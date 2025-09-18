import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput } from './dto';
import { RecruiterProfile } from './entities/recruiter-profile.entity';
import { CurrentUser } from 'src/common';

@Injectable()
export class RecruiterProfileService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private readonly recruiterProfileRepository: Repository<RecruiterProfile>,
  ) {}

  async create(createRecruiterProfileInput: CreateRecruiterProfileInput): Promise<RecruiterProfile> {
    const profile = this.recruiterProfileRepository.create(createRecruiterProfileInput);
    return await this.recruiterProfileRepository.save(profile);
  }

  async findAll(): Promise<RecruiterProfile[]> {
    const profiles = await this.recruiterProfileRepository.find({ order: { createdAt: 'DESC' } });
    return profiles;
  }

  async findOne(id: string, organizationId: string): Promise<RecruiterProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.recruiterProfileRepository.findOne({ where: { id, organizationId } });
    if (!profile) throw new NotFoundException(`Recruiter profile with ID ${id} not found`);
    return profile;
  }

  async findOneByUserId(userId: string, { organizationId }: CurrentUser): Promise<RecruiterProfile> {
    const profile = await this.recruiterProfileRepository.findOne({ where: { user: { id: userId }, organizationId } });
    if (!profile) throw new NotFoundException(`Recruiter profile with user ID ${userId} not found`);
    return profile;
  }

  async update(id: string, organizationId: string, updateRecruiterProfileInput: UpdateRecruiterProfileInput): Promise<RecruiterProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.findOne(id, organizationId);
    Object.assign(profile, updateRecruiterProfileInput);
    const saved = await this.recruiterProfileRepository.save(profile);
    return saved;
  }

  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.recruiterProfileRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    await this.recruiterProfileRepository.remove(profile);
  }
}
