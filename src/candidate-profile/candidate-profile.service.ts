import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';
import { CandidateProfile } from './entities/candidate-profile.entity';

@Injectable()
export class CandidateProfileService {
  constructor(@InjectRepository(CandidateProfile) private readonly candidateRepo: Repository<CandidateProfile>) {}

  async create(createCandidateProfileInput: CreateCandidateProfileInput): Promise<CandidateProfile> {
    const profile = this.candidateRepo.create(createCandidateProfileInput);
    return this.candidateRepo.save(profile);
  }

  async findAll(): Promise<CandidateProfile[]> {
    return this.candidateRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<CandidateProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.candidateRepo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`Candidate profile with ID ${id} not found`);
    return profile;
  }

  async update(id: string, updateCandidateProfileInput: UpdateCandidateProfileInput): Promise<CandidateProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.findOne(id);
    Object.assign(profile, updateCandidateProfileInput);
    return this.candidateRepo.save(profile);
  }

  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.findOne(id);
    await this.candidateRepo.remove(profile);
  }
}
