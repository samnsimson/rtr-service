import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput, RecruiterProfileResponse } from './dto';
import { RecruiterProfile } from './entities/recruiter-profile.entity';

@Injectable()
export class RecruiterProfileService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private readonly recruiterProfileRepository: Repository<RecruiterProfile>,
  ) {}

  async create(createRecruiterProfileInput: CreateRecruiterProfileInput): Promise<RecruiterProfileResponse> {
    const profile = this.recruiterProfileRepository.create(createRecruiterProfileInput);
    const saved = await this.recruiterProfileRepository.save(profile);
    return this.toResponse(saved);
  }

  async findAll(): Promise<RecruiterProfileResponse[]> {
    const profiles = await this.recruiterProfileRepository.find({
      order: { createdAt: 'DESC' },
    });
    return profiles.map(this.toResponse);
  }

  async findOne(id: string): Promise<RecruiterProfileResponse> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.recruiterProfileRepository.findOne({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Recruiter profile with ID ${id} not found`);
    }

    return this.toResponse(profile);
  }

  async update(id: string, updateRecruiterProfileInput: UpdateRecruiterProfileInput): Promise<RecruiterProfileResponse> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.findOne(id);
    const updatedProfile = await this.recruiterProfileRepository.findOne({ where: { id } });
    if (!updatedProfile) throw new NotFoundException('Profile not found');
    
    Object.assign(updatedProfile, updateRecruiterProfileInput);
    const saved = await this.recruiterProfileRepository.save(updatedProfile);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.recruiterProfileRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    await this.recruiterProfileRepository.remove(profile);
  }

  private toResponse = (profile: RecruiterProfile): RecruiterProfileResponse => ({
    id: profile.id,
    userId: profile.userId,
    title: profile.title,
    bio: profile.bio,
    linkedinUrl: profile.linkedinUrl,
    avatar: profile.avatar,
    organizationId: profile.organizationId,
    isActive: profile.isActive,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  });
}
