import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateCandidateProfileInput, UpdateCandidateProfileInput } from './dto';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { CurrentUser } from 'src/common';

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

  async findOne(id: string, user: CurrentUser): Promise<CandidateProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.candidateRepo.findOne({ where: { id, organizationId: user.organizationId } });
    if (!profile) throw new NotFoundException(`Candidate profile with ID ${id} not found`);
    return profile;
  }

  async findOneWhere(where: FindOptionsWhere<CandidateProfile>, user: CurrentUser): Promise<CandidateProfile | null> {
    const profile = await this.candidateRepo.findOne({ where: { ...where, organizationId: user.organizationId } });
    // if (!profile) throw new NotFoundException(`Candidate profile not found`);
    return profile;
  }

  async update(id: string, user: CurrentUser, updateCandidateProfileInput: UpdateCandidateProfileInput): Promise<CandidateProfile> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.findOne(id, user);
    Object.assign(profile, updateCandidateProfileInput);
    return this.candidateRepo.save(profile);
  }

  async remove(id: string, user: CurrentUser): Promise<void> {
    if (!id) throw new BadRequestException('Profile ID is required');
    const profile = await this.findOne(id, user);
    await this.candidateRepo.remove(profile);
  }
}
