import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateJobInput, JobResponse } from './dto';
import { Job } from './entities/job.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { CurrentUser } from '../common/types';
import { CreateJobInput } from './dto/create-job.input';
import { JobListFiltersInput } from './dto/job-list-filters.input';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobsRepo: Repository<Job>,
    @InjectRepository(RecruiterProfile) private readonly recruiterProfileRepo: Repository<RecruiterProfile>,
  ) {}

  async create(createJobInput: CreateJobInput, user: CurrentUser): Promise<JobResponse> {
    const recruiterProfile = await this.recruiterProfileRepo.findOne({ where: { userId: user.id } });
    if (!recruiterProfile) throw new ForbiddenException('Recruiter profile not found');

    const { expiresAt, ...rest } = createJobInput;
    const job = this.jobsRepo.create({
      ...rest,
      recruiterId: recruiterProfile.id,
      organizationId: user.organizationId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    const saved = await this.jobsRepo.save(job);
    return this.toResponse(saved);
  }

  async findAll(user: CurrentUser, filters: JobListFiltersInput): Promise<[JobResponse[], number]> {
    let query = this.jobsRepo.createQueryBuilder('job');
    const { page, limit, query: queryString, workType, jobType, compensation } = filters;
    if (user.organizationId) query = query.where('job.organizationId = :organizationId', { organizationId: user.organizationId });
    if (queryString) query = query.andWhere('job.title ILIKE :query', { query: `%${queryString}%` });
    if (workType) query = query.andWhere('job.workType = :workType', { workType });
    if (jobType) query = query.andWhere('job.jobType = :jobType', { jobType });
    if (compensation) query = query.andWhere('job.compensation = :compensation', { compensation });
    query = query.skip((page - 1) * limit).take(limit);
    query = query.orderBy('job.createdAt', 'DESC');
    const [jobs, count] = await query.getManyAndCount();
    return [jobs.map(this.toResponse), count];
  }

  async findOne(id: string, user?: CurrentUser): Promise<JobResponse> {
    let query = this.jobsRepo.createQueryBuilder('job').where('job.id = :id', { id });

    // If user has organization, filter by organization
    if (user?.organizationId) {
      query = query.andWhere('job.organizationId = :organizationId', { organizationId: user.organizationId });
    }

    const job = await query.getOne();
    if (!job) throw new NotFoundException('Job not found');
    return this.toResponse(job);
  }

  async update(id: string, updateJobInput: UpdateJobInput, user: CurrentUser): Promise<JobResponse> {
    const job = await this.findOne(id, user);
    const { expiresAt, ...rest } = updateJobInput;
    const next = { ...job, ...rest, expiresAt: typeof expiresAt === 'string' ? new Date(expiresAt) : job.expiresAt };
    const saved = await this.jobsRepo.save(next);
    return this.toResponse(saved);
  }

  async remove(id: string, user: CurrentUser): Promise<JobResponse> {
    const job = await this.jobsRepo.findOne({ where: { id, organizationId: user.organizationId } });
    if (!job) throw new NotFoundException('Job not found');

    await this.jobsRepo.remove(job);
    return this.toResponse(job);
  }

  async findJobsByOrganization(organizationId: string): Promise<JobResponse[]> {
    const jobs = await this.jobsRepo.find({ where: { organizationId } });
    return jobs.map(this.toResponse);
  }

  async findJobsByRecruiter(recruiterId: string, user?: CurrentUser): Promise<JobResponse[]> {
    let query = this.jobsRepo.createQueryBuilder('job').where('job.recruiterId = :recruiterId', { recruiterId });

    // If user has organization, filter by organization
    if (user?.organizationId) {
      query = query.andWhere('job.organizationId = :organizationId', { organizationId: user.organizationId });
    }

    const jobs = await query.getMany();
    return jobs.map(this.toResponse);
  }

  private toResponse = (job: Job): JobResponse => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    requirements: job.requirements,
    location: job.location,
    workType: job.workType,
    jobType: job.jobType,
    compensation: job.compensation,
    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,
    benefits: job.benefits,
    recruiterId: job.recruiterId,
    organizationId: job.organizationId ?? null,
    status: job.status,
    expiresAt: job.expiresAt ?? null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
}
