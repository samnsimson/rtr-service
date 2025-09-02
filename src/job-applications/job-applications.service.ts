import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateJobApplicationInput, UpdateJobApplicationInput } from './dto';
import { JobApplication } from './entities/job-application.entity';
import { Job } from '../jobs/entities/job.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { ApplicationStatus, UserRole } from '../common/enums';
import { CurrentUser } from '../common/types';
import { EmailService } from '../email/email.service';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectRepository(JobApplication) private jobApplicationRepo: Repository<JobApplication>,
    @InjectRepository(Job) private jobRepo: Repository<Job>,
    @InjectRepository(CandidateProfile) private candidateRepo: Repository<CandidateProfile>,
    @InjectRepository(RecruiterProfile) private recruiterRepo: Repository<RecruiterProfile>,
    private emailService: EmailService,
  ) {}

  async create(createJobApplicationInput: CreateJobApplicationInput, user: CurrentUser): Promise<JobApplication> {
    const { jobId, candidateId, status, coverLetter, notes } = createJobApplicationInput;
    // Verify job exists and is active
    const job = await this.jobRepo.findOne({ where: { id: jobId }, relations: ['organization'] });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'ACTIVE') throw new BadRequestException('Job is not active for applications');

    // Verify candidate exists
    const candidate = await this.candidateRepo.findOne({ where: { id: candidateId }, relations: ['user'] });
    if (!candidate) throw new NotFoundException('Candidate not found');

    // Check if application already exists
    const existingApplication = await this.jobApplicationRepo.findOne({ where: { jobId, candidateId } });
    if (existingApplication) throw new BadRequestException('Application already exists for this job');

    // Verify user has permission to create application for this candidate
    if (user.role === UserRole.CANDIDATE && candidate.userId !== user.id) {
      throw new ForbiddenException('You can only apply for jobs yourself');
    }

    // Set organization ID based on job's organization
    const organizationId = job.organizationId;

    const jobApplication = this.jobApplicationRepo.create({
      jobId,
      candidateId,
      organizationId,
      status: status || ApplicationStatus.APPLIED,
      coverLetter,
      notes,
    });

    const savedApplication = await this.jobApplicationRepo.save(jobApplication);

    // Send notification email to recruiter
    await this.sendApplicationNotification(savedApplication, job, candidate);

    return savedApplication;
  }

  async findAll(user: CurrentUser): Promise<JobApplication[]> {
    const where: FindOptionsWhere<JobApplication> = {};

    // Filter by organization for non-admin users
    if (user.role !== UserRole.ADMIN && user.organizationId) {
      where.organizationId = user.organizationId;
    }

    // For candidates, only show their own applications
    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.candidateRepo.findOne({ where: { userId: user.id } });
      if (candidate) {
        where.candidateId = candidate.id;
      } else {
        return []; // No candidate profile found
      }
    }

    return this.jobApplicationRepo.find({
      where,
      relations: ['job', 'candidate', 'organization'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findOne(id: string, user: CurrentUser): Promise<JobApplication> {
    const application = await this.jobApplicationRepo.findOne({
      where: { id },
      relations: ['job', 'candidate', 'organization'],
    });

    if (!application) throw new NotFoundException('Job application not found');

    // Check permissions
    await this.checkApplicationAccess(application, user);

    return application;
  }

  async update(id: string, updateJobApplicationInput: UpdateJobApplicationInput, user: CurrentUser): Promise<JobApplication> {
    const application = await this.findOne(id, user);

    // Only allow status updates for recruiters and admins
    if (updateJobApplicationInput.status && user.role === UserRole.CANDIDATE) {
      throw new ForbiddenException('Candidates cannot update application status');
    }

    // Update application
    Object.assign(application, updateJobApplicationInput);
    const updatedApplication = await this.jobApplicationRepo.save(application);

    // Send status update notification
    if (updateJobApplicationInput.status) {
      await this.sendStatusUpdateNotification(updatedApplication);
    }

    return updatedApplication;
  }

  async remove(id: string, user: CurrentUser): Promise<JobApplication> {
    const application = await this.findOne(id, user);

    // Only candidates can withdraw their own applications
    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.candidateRepo.findOne({ where: { userId: user.id } });
      if (!candidate || application.candidateId !== candidate.id) {
        throw new ForbiddenException('You can only withdraw your own applications');
      }
    }

    await this.jobApplicationRepo.remove(application);
    return application;
  }

  async findByJob(jobId: string, user: CurrentUser): Promise<JobApplication[]> {
    // Verify job exists and user has access
    const job = await this.jobRepo.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');

    // Check if user has access to this job's applications
    if (user.role === UserRole.CANDIDATE) {
      throw new ForbiddenException('Candidates cannot view other applications for a job');
    }

    if (user.role !== UserRole.ADMIN && job.organizationId !== user.organizationId) {
      throw new ForbiddenException('You can only view applications for jobs in your organization');
    }

    return this.jobApplicationRepo.find({
      where: { jobId },
      relations: ['candidate', 'job'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findByCandidate(candidateId: string, user: CurrentUser): Promise<JobApplication[]> {
    // For candidates, only allow viewing their own applications
    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.candidateRepo.findOne({ where: { userId: user.id } });
      if (!candidate || candidate.id !== candidateId) {
        throw new ForbiddenException('You can only view your own applications');
      }
    }

    return this.jobApplicationRepo.find({
      where: { candidateId },
      relations: ['job', 'organization'],
      order: { appliedAt: 'DESC' },
    });
  }

  async getApplicationStats(user: CurrentUser): Promise<{ total: number; byStatus: Record<ApplicationStatus, number> }> {
    const where: FindOptionsWhere<JobApplication> = {};

    // Filter by organization for non-admin users
    if (user.role !== UserRole.ADMIN && user.organizationId) {
      where.organizationId = user.organizationId;
    }

    // For candidates, only show their own applications
    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.candidateRepo.findOne({ where: { userId: user.id } });
      if (candidate) {
        where.candidateId = candidate.id;
      } else {
        return { total: 0, byStatus: {} as Record<ApplicationStatus, number> };
      }
    }

    const applications = await this.jobApplicationRepo.find({ where });
    const total = applications.length;
    const byStatus = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    return { total, byStatus };
  }

  private async checkApplicationAccess(application: JobApplication, user: CurrentUser): Promise<void> {
    // Admins can access all applications
    if (user.role === UserRole.ADMIN) return;

    // Organization members can access applications in their organization
    if (user.organizationId && application.organizationId === user.organizationId) return;

    // Candidates can access their own applications
    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.candidateRepo.findOne({ where: { userId: user.id } });
      if (candidate && application.candidateId === candidate.id) return;
    }

    throw new ForbiddenException('You do not have access to this application');
  }

  private async sendApplicationNotification(application: JobApplication, job: Job, candidate: CandidateProfile): Promise<void> {
    try {
      // Get recruiter profile to get email
      const recruiterProfile = await this.recruiterRepo.findOne({
        where: { id: job.recruiterId },
        relations: ['user'],
      });

      const recruiterEmail = recruiterProfile?.user?.email || 'recruiter@example.com';

      this.emailService.sendApplicationNotification(recruiterEmail, candidate.user.name || 'Candidate', job.title, application.coverLetter);
    } catch (error) {
      console.error('Failed to send application notification:', error);
    }
  }

  private async sendStatusUpdateNotification(application: JobApplication): Promise<void> {
    try {
      const candidate = await this.candidateRepo.findOne({ where: { id: application.candidateId }, relations: ['user'] });
      const job = await this.jobRepo.findOne({ where: { id: application.jobId } });

      if (candidate && job) {
        this.emailService.sendApplicationStatusUpdate(candidate.user.email, candidate.user.name || 'Candidate', job.title, application.status);
      }
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }
  }
}
