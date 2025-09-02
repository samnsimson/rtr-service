import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums';
import { CreateOrganizationInput, UpdateOrganizationInput, CreateOrganizationUserInput } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createOrganization(createOrganizationInput: CreateOrganizationInput, ownerId: string): Promise<Organization> {
    const organization = this.organizationRepo.create(createOrganizationInput);
    const savedOrganization = await this.organizationRepo.save(organization);

    // Update the owner to be an organization owner
    await this.userRepo.update(ownerId, {
      role: UserRole.ORGANIZATION_OWNER,
      organizationId: savedOrganization.id,
    });

    return savedOrganization;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepo.findOne({
      where: { id, isActive: true },
      relations: ['users'],
    });
    if (!organization) throw new NotFoundException('Organization not found');
    return organization;
  }

  async updateOrganization(id: string, updateOrganizationInput: UpdateOrganizationInput, userId: string): Promise<Organization> {
    const organization = await this.findOne(id);

    // Check if user has permission to update organization
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== id || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions to update organization');
    }

    Object.assign(organization, updateOrganizationInput);
    return this.organizationRepo.save(organization);
  }

  async removeOrganization(id: string, userId: string): Promise<boolean> {
    const organization = await this.findOne(id);

    // Only organization owner can delete
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== id || user.role !== UserRole.ORGANIZATION_OWNER) {
      throw new ForbiddenException('Only organization owner can delete organization');
    }

    // Soft delete - mark as inactive
    organization.isActive = false;
    await this.organizationRepo.save(organization);

    // Remove all users from organization
    await this.userRepo.update({ organizationId: id }, { organizationId: null as any });

    return true;
  }

  async createUser(organizationId: string, createUserInput: CreateOrganizationUserInput, creatorId: string): Promise<User> {
    // Check if creator has permission to create users in this organization
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    if (!creator || creator.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(creator.role)) {
      throw new ForbiddenException('Insufficient permissions to create users in this organization');
    }

    // Check if email already exists
    const existingUser = await this.userRepo.findOne({ where: { email: createUserInput.email } });
    if (existingUser) throw new ConflictException('User with this email already exists');

    const user = this.userRepo.create({
      ...createUserInput,
      organizationId,
      createdById: creatorId,
      role: createUserInput.role || UserRole.RECRUITER,
    });

    return this.userRepo.save(user);
  }

  async getOrganizationUsers(organizationId: string, userId: string): Promise<User[]> {
    // Check if user has access to this organization
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied to organization users');
    }

    return this.userRepo.find({
      where: { organizationId, isActive: true },
      relations: ['recruiterProfile', 'candidateProfile'],
    });
  }

  async updateUserRole(organizationId: string, userId: string, newRole: UserRole, updaterId: string): Promise<User> {
    // Check if updater has permission
    const updater = await this.userRepo.findOne({ where: { id: updaterId } });
    if (!updater || updater.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(updater.role)) {
      throw new ForbiddenException('Insufficient permissions to update user roles');
    }

    // Check if user exists in organization
    const user = await this.userRepo.findOne({ where: { id: userId, organizationId } });
    if (!user) throw new NotFoundException('User not found in organization');

    // Only organization owner can promote to admin
    if (newRole === UserRole.ORGANIZATION_ADMIN && updater.role !== UserRole.ORGANIZATION_OWNER) {
      throw new ForbiddenException('Only organization owner can promote to admin');
    }

    user.role = newRole;
    return this.userRepo.save(user);
  }

  async removeUserFromOrganization(organizationId: string, userId: string, removerId: string): Promise<boolean> {
    // Check if remover has permission
    const remover = await this.userRepo.findOne({ where: { id: removerId } });
    if (!remover || remover.organizationId !== organizationId || ![UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN].includes(remover.role)) {
      throw new ForbiddenException('Insufficient permissions to remove users');
    }

    // Check if user exists in organization
    const user = await this.userRepo.findOne({ where: { id: userId, organizationId } });
    if (!user) throw new NotFoundException('User not found in organization');

    // Cannot remove organization owner
    if (user.role === UserRole.ORGANIZATION_OWNER) {
      throw new ForbiddenException('Cannot remove organization owner');
    }

    // Remove user from organization
    user.organizationId = null;
    user.role = UserRole.CANDIDATE; // Reset to basic role
    await this.userRepo.save(user);

    return true;
  }

  async getOrganizationStats(organizationId: string, userId: string): Promise<any> {
    // Check if user has access to this organization
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied to organization stats');
    }

    const [userCount, recruiterCount, candidateCount] = await Promise.all([
      this.userRepo.count({ where: { organizationId, isActive: true } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.RECRUITER } }),
      this.userRepo.count({ where: { organizationId, isActive: true, role: UserRole.CANDIDATE } }),
    ]);

    return {
      totalUsers: userCount,
      recruiters: recruiterCount,
      candidates: candidateCount,
    };
  }
}
