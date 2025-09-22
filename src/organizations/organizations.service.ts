import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums';
import { CreateOrganizationInput, UpdateOrganizationInput, CreateOrganizationUserInput } from './dto';
import { EventEmitterService } from '../common/events/event-emitter.service';
import { OrganizationCreatedEvent, OrganizationUpdatedEvent, OrganizationDeletedEvent, EVENTS } from '../common/events/events.types';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async createOrganization(createOrganizationInput: CreateOrganizationInput, ownerId: string): Promise<Organization> {
    const organization = this.organizationRepo.create(createOrganizationInput);
    const org = await this.organizationRepo.save(organization);
    await this.userRepo.update(ownerId, { organizationId: org.id, role: UserRole.ORGANIZATION_OWNER });
    const event: OrganizationCreatedEvent = { organizationId: org.id, organizationName: org.name, ownerId, createdAt: org.createdAt };
    this.eventEmitter.emit(EVENTS.ORGANIZATION_CREATED, event);
    return org;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepo.findOne({ where: { id, isActive: true }, relations: ['users'] });
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async updateOrganization(id: string, updateOrganizationInput: UpdateOrganizationInput, userId: string): Promise<Organization> {
    const organization = await this.findOne(id);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== id) throw new ForbiddenException('Insufficient permissions to update organization');
    Object.assign(organization, updateOrganizationInput);
    const org = await this.organizationRepo.save(organization);
    const event: OrganizationUpdatedEvent = { organizationId: org.id, organizationName: org.name, updatedAt: org.updatedAt };
    this.eventEmitter.emit(EVENTS.ORGANIZATION_UPDATED, event);
    return org;
  }

  async removeOrganization(id: string, userId: string): Promise<boolean> {
    const organization = await this.findOne(id);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== id || user.role !== UserRole.ORGANIZATION_OWNER) {
      throw new ForbiddenException('Only organization owner can delete organization');
    }

    organization.isActive = false;
    await this.organizationRepo.save(organization);
    await this.userRepo.update({ organizationId: id }, { organizationId: null as any });
    const event: OrganizationDeletedEvent = { organizationId: organization.id, organizationName: organization.name, deletedAt: new Date() };
    this.eventEmitter.emit(EVENTS.ORGANIZATION_DELETED, event);
    return true;
  }

  async createUser(organizationId: string, createUserInput: CreateOrganizationUserInput, creatorId: string): Promise<User> {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator || creator.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(creator.role)) {
      throw new ForbiddenException('Insufficient permissions to create users in this organization');
    }

    const existingUser = await this.userRepo.findOne({ where: { email: createUserInput.email } });
    if (existingUser) throw new ConflictException('User with this email already exists');
    const user = this.userRepo.create({ ...createUserInput, organizationId, createdById: creatorId, role: createUserInput.role || UserRole.RECRUITER });
    return this.userRepo.save(user);
  }

  async getOrganizationUsers(organizationId: string, userId: string): Promise<User[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== organizationId) throw new ForbiddenException('Access denied to organization users');
    return this.userRepo.find({ where: { organizationId, isActive: true }, relations: ['recruiterProfile', 'candidateProfile'] });
  }

  async updateUserRole(organizationId: string, userId: string, newRole: UserRole, updaterId: string): Promise<User> {
    const updater = await this.userRepo.findOne({ where: { id: updaterId } });
    if (!updater || updater.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(updater.role)) {
      throw new ForbiddenException('Insufficient permissions to update user roles');
    }
    const user = await this.userRepo.findOne({ where: { id: userId, organizationId } });
    if (!user) throw new NotFoundException('User not found in organization');
    if (newRole === UserRole.ORGANIZATION_ADMIN && updater.role !== UserRole.ORGANIZATION_OWNER) {
      throw new ForbiddenException('Only organization owner can promote to admin');
    }

    user.role = newRole;
    return this.userRepo.save(user);
  }

  async removeUserFromOrganization(organizationId: string, userId: string, removerId: string): Promise<boolean> {
    const remover = await this.userRepo.findOne({ where: { id: removerId } });
    if (!remover || remover.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(remover.role)) {
      throw new ForbiddenException('Insufficient permissions to remove users');
    }

    const user = await this.userRepo.findOne({ where: { id: userId, organizationId } });
    if (!user) throw new NotFoundException('User not found in organization');
    if (user.role === UserRole.ORGANIZATION_OWNER) throw new ForbiddenException('Cannot remove organization owner');

    user.organizationId = null;
    user.role = UserRole.CANDIDATE;
    await this.userRepo.save(user);
    return true;
  }

  async getOrganizationStats(organizationId: string, userId: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== organizationId) throw new ForbiddenException('Access denied to organization stats');
    const [userCount, recruiterCount, candidateCount] = await Promise.all([
      this.userRepo.count({ where: { organizationId, isActive: true } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.RECRUITER } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.CANDIDATE } }),
    ]);
    return { totalUsers: userCount, recruiters: recruiterCount, candidates: candidateCount };
  }

  async getOrganizationStatsForOverview(organizationId: string): Promise<{ totalUsers: number; totalRecruiters: number; totalCandidates: number }> {
    const [userCount, recruiterCount, candidateCount] = await Promise.all([
      this.userRepo.count({ where: { organizationId, isActive: true } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.RECRUITER } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.CANDIDATE } }),
    ]);
    return { totalUsers: userCount, totalRecruiters: recruiterCount, totalCandidates: candidateCount };
  }
}
