import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobInput, UpdateJobInput, JobResponse } from './dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private readonly jobsRepo: Repository<Job>) {}

  async create(createJobInput: CreateJobInput): Promise<JobResponse> {
    const { expiresAt, ...rest } = createJobInput;
    const job = this.jobsRepo.create({ ...rest, expiresAt: expiresAt ? new Date(expiresAt) : undefined });
    const saved = await this.jobsRepo.save(job);
    return this.toResponse(saved);
  }

  async findAll(): Promise<JobResponse[]> {
    const jobs = await this.jobsRepo.find();
    return jobs.map(this.toResponse);
  }

  async findOne(id: string): Promise<JobResponse> {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return this.toResponse(job);
  }

  async update(id: string, updateJobInput: UpdateJobInput): Promise<JobResponse> {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    const { expiresAt, ...rest } = updateJobInput;
    const next = { ...job, ...rest, expiresAt: typeof expiresAt === 'string' ? new Date(expiresAt) : job.expiresAt };
    const saved = await this.jobsRepo.save(next);
    return this.toResponse(saved);
  }

  async remove(id: string): Promise<JobResponse> {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobsRepo.remove(job);
    return this.toResponse(job);
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
    status: job.status,
    expiresAt: job.expiresAt ?? null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });
}
