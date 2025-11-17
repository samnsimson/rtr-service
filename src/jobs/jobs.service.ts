import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, MoreThanOrEqual } from 'typeorm';
import { UpdateJobInput, JobResponse } from './dto';
import { Job } from './entities/job.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { CurrentUser } from '../common/types';
import { CreateJobInput } from './dto/create-job.input';
import { JobStatus } from '../common/enums';
import { JobListFiltersInput } from './dto/job-list-filters.input';
import { CompanyResponse } from './dto/company-response.dto';

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
    return new JobResponse(saved);
  }

  async findAll(user: CurrentUser, filters: JobListFiltersInput): Promise<[JobResponse[], number]> {
    let query = this.jobsRepo.createQueryBuilder('job');
    const { page, limit, query: queryString, workType, jobType, compensation, starred } = filters;
    if (user.organizationId) query = query.where('job.organizationId = :organizationId', { organizationId: user.organizationId });
    if (queryString) query = query.andWhere('job.title ILIKE :query', { query: `%${queryString}%` });
    if (workType) query = query.andWhere('job.workType = :workType', { workType });
    if (jobType) query = query.andWhere('job.jobType = :jobType', { jobType });
    if (compensation) query = query.andWhere('job.compensation = :compensation', { compensation });
    if (starred) query = query.andWhere('job.starred = :starred', { starred });
    query = query.skip((page - 1) * limit).take(limit);
    query = query.orderBy('job.createdAt', 'DESC');
    const [jobs, count] = await query.getManyAndCount();
    return [jobs.map((job) => new JobResponse(job)), count];
  }

  async findCompanies(user: CurrentUser): Promise<CompanyResponse[]> {
    let query = this.jobsRepo.createQueryBuilder('job');
    if (user.organizationId) query = query.where('job.organizationId = :organizationId', { organizationId: user.organizationId });
    const companies = await query.select('DISTINCT job.company', 'company').getRawMany<{ company: string }>();
    return companies.map(({ company }) => new CompanyResponse({ name: company }));
  }

  async findOne(id: string, user: CurrentUser, options?: FindOptionsWhere<Job>): Promise<JobResponse> {
    let query = this.jobsRepo.createQueryBuilder('job').where('job.id = :id', { id });
    if (user.organizationId) query = query.andWhere('job.organizationId = :organizationId', { organizationId: user.organizationId });
    if (options) query = query.andWhere(options);
    const job = await query.getOne();
    if (!job) throw new NotFoundException('Job not found');
    return new JobResponse(job);
  }

  async update(id: string, updateJobInput: UpdateJobInput, user: CurrentUser): Promise<JobResponse> {
    const { affected } = await this.jobsRepo.update(id, updateJobInput);
    if (!affected) throw new NotFoundException('Job not found');
    const job = await this.findOne(id, user);
    return new JobResponse(job);
  }

  async remove(id: string, user: CurrentUser): Promise<JobResponse> {
    const job = await this.jobsRepo.findOne({ where: { id, organizationId: user.organizationId } });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobsRepo.remove(job);
    return new JobResponse(job);
  }

  async findJobsByOrganization(organizationId: string): Promise<JobResponse[]> {
    const jobs = await this.jobsRepo.find({ where: { organizationId } });
    return jobs.map((job) => new JobResponse(job));
  }

  async findJobsByRecruiter(recruiterId: string, user?: CurrentUser): Promise<JobResponse[]> {
    let query = this.jobsRepo.createQueryBuilder('job').where('job.recruiterId = :recruiterId', { recruiterId });
    if (user?.organizationId) query = query.andWhere('job.organizationId = :organizationId', { organizationId: user.organizationId });
    const jobs = await query.getMany();
    return jobs.map((job) => new JobResponse(job));
  }

  private toResponse = (job: Job): JobResponse => new JobResponse(job);

  // Count methods for overview service
  async countByOrganization(organizationId: string): Promise<number> {
    return this.jobsRepo.count({ where: { organizationId } });
  }

  async countByOrganizationAndStatus(organizationId: string, status: JobStatus): Promise<number> {
    return this.jobsRepo.count({ where: { organizationId, status } });
  }

  async countByOrganizationThisMonth(organizationId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return this.jobsRepo.count({ where: { organizationId, createdAt: MoreThanOrEqual(startOfMonth) } });
  }
}
