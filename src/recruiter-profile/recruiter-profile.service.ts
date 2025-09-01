import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecruiterProfileInput, UpdateRecruiterProfileInput } from './dto';
import { RecruiterProfile } from './entities/recruiter-profile.entity';

@Injectable()
export class RecruiterProfileService {
  constructor(
    @InjectRepository(RecruiterProfile)
    private readonly recruiterProfileRepository: Repository<RecruiterProfile>,
  ) {}

  async create(createRecruiterProfileInput: CreateRecruiterProfileInput): Promise<RecruiterProfile> {
    const profile = this.recruiterProfileRepository.create(createRecruiterProfileInput);
    return this.recruiterProfileRepository.save(profile);
  }

  async findAll(): Promise<RecruiterProfile[]> {
    return this.recruiterProfileRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<RecruiterProfile> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.recruiterProfileRepository.findOne({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Recruiter profile with ID ${id} not found`);
    }

    return profile;
  }

  async update(id: string, updateRecruiterProfileInput: UpdateRecruiterProfileInput): Promise<RecruiterProfile> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.findOne(id);
    Object.assign(profile, updateRecruiterProfileInput);
    return this.recruiterProfileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const profile = await this.findOne(id);
    await this.recruiterProfileRepository.remove(profile);
  }
}
