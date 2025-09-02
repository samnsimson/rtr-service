import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RTR } from './entities/rtr.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Job } from '../jobs/entities/job.entity';
import { RTRHistory } from '../rtr-history/entities/rtr-history.entity';
import { CreateRTRInput, UpdateRTRInput } from './dto';
import { RTRStatus, UserRole } from '../common/enums';
import { CurrentUser } from '../common/types';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RTRService {
  constructor(
    @InjectRepository(RTR) private readonly rtrRepo: Repository<RTR>,
    @InjectRepository(CandidateProfile) private readonly candidateRepo: Repository<CandidateProfile>,
    @InjectRepository(RecruiterProfile) private readonly recruiterRepo: Repository<RecruiterProfile>,
    @InjectRepository(Job) private readonly jobRepo: Repository<Job>,
    @InjectRepository(RTRHistory) private readonly historyRepo: Repository<RTRHistory>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async create(createRtrInput: CreateRTRInput, user: CurrentUser): Promise<RTR> {
    const { candidateId, recruiterId, jobId, status, notes, expiresAt, userId } = createRtrInput;

    // Verify candidate exists
    const candidate = await this.candidateRepo.findOne({
      where: { id: candidateId },
      relations: ['user'],
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    // Verify recruiter exists and belongs to user's organization
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['user', 'organization'],
    });
    if (!recruiter) throw new NotFoundException('Recruiter not found');
    if (recruiter.organizationId !== user.organizationId) throw new ForbiddenException('Recruiter does not belong to your organization');

    // Verify job exists if provided
    let job: Job | null = null;
    if (jobId) {
      job = await this.jobRepo.findOne({ where: { id: jobId } });
      if (!job) throw new NotFoundException('Job not found');
    }

    // Check if RTR already exists for this candidate and job combination
    const whereCondition: any = { candidateId, status: RTRStatus.PENDING };
    if (jobId) {
      whereCondition.jobId = jobId;
    } else {
      whereCondition.jobId = null;
    }
    const existingRTR = await this.rtrRepo.findOne({ where: whereCondition });
    if (existingRTR) throw new BadRequestException('A pending RTR already exists for this candidate and job');

    // Create RTR
    const rtr = this.rtrRepo.create({
      candidateId,
      recruiterId,
      jobId,
      organizationId: user.organizationId,
      status: status || RTRStatus.PENDING,
      notes,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      userId: userId || candidate.userId,
    });

    const savedRTR = await this.rtrRepo.save(rtr);

    // Create history entry
    await this.createHistoryEntry(savedRTR.id, 'RTR created', user.id);

    // Send email notification to candidate
    await this.sendRTRNotification(savedRTR, candidate, recruiter, job);

    return this.findOne(savedRTR.id, user);
  }

  async findAll(user?: CurrentUser): Promise<RTR[]> {
    const where: any = {};
    if (user) where.organizationId = user.organizationId;

    return this.rtrRepo.find({
      where,
      relations: ['candidate', 'candidate.user', 'recruiter', 'recruiter.user', 'job', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user?: CurrentUser): Promise<RTR> {
    const where: any = { id };
    if (user) where.organizationId = user.organizationId;

    const rtr = await this.rtrRepo.findOne({
      where,
      relations: ['candidate', 'candidate.user', 'recruiter', 'recruiter.user', 'job', 'organization', 'history', 'documents'],
    });

    if (!rtr) throw new NotFoundException('RTR not found');
    return rtr;
  }

  async update(id: string, updateRtrInput: UpdateRTRInput, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);

    // Check if user can update this RTR
    if (rtr.recruiterId !== user.id && !this.isOrganizationAdmin(user)) {
      throw new ForbiddenException('You can only update RTRs you created');
    }

    const oldStatus = rtr.status;
    Object.assign(rtr, updateRtrInput);

    if (updateRtrInput.expiresAt) rtr.expiresAt = new Date(updateRtrInput.expiresAt);

    const savedRTR = await this.rtrRepo.save(rtr);

    // Create history entry for status change
    if (oldStatus !== savedRTR.status) {
      await this.createHistoryEntry(savedRTR.id, `Status changed from ${oldStatus} to ${savedRTR.status}`, user.id);
    }

    return this.findOne(savedRTR.id, user);
  }

  async remove(id: string, user: CurrentUser): Promise<boolean> {
    const rtr = await this.findOne(id, user);

    // Check if user can delete this RTR
    if (rtr.recruiterId !== user.id && !this.isOrganizationAdmin(user)) {
      throw new ForbiddenException('You can only delete RTRs you created');
    }

    await this.rtrRepo.remove(rtr);
    return true;
  }

  async approveRTR(id: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);

    if (rtr.status !== RTRStatus.PENDING) {
      throw new BadRequestException('Only pending RTRs can be approved');
    }

    rtr.status = RTRStatus.SIGNED;
    rtr.signedAt = new Date();
    rtr.viewedAt = new Date();

    const savedRTR = await this.rtrRepo.save(rtr);

    // Create history entry
    await this.createHistoryEntry(savedRTR.id, 'RTR approved by candidate', user.id);

    // Send status update email to recruiter
    await this.sendRTRStatusUpdate(savedRTR, 'approved');

    return this.findOne(savedRTR.id, user);
  }

  async rejectRTR(id: string, reason: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);

    if (rtr.status !== RTRStatus.PENDING) {
      throw new BadRequestException('Only pending RTRs can be rejected');
    }

    rtr.status = RTRStatus.REJECTED;
    rtr.notes = rtr.notes ? `${rtr.notes}\nRejection reason: ${reason}` : `Rejection reason: ${reason}`;
    rtr.viewedAt = new Date();

    const savedRTR = await this.rtrRepo.save(rtr);

    // Create history entry
    await this.createHistoryEntry(savedRTR.id, `RTR rejected by candidate. Reason: ${reason}`, user.id);

    // Send status update email to recruiter
    await this.sendRTRStatusUpdate(savedRTR, 'rejected');

    return this.findOne(savedRTR.id, user);
  }

  async markAsViewed(id: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);

    if (!rtr.viewedAt) {
      rtr.viewedAt = new Date();
      await this.rtrRepo.save(rtr);
    }

    return rtr;
  }

  async getRTRsByCandidate(candidateId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { candidateId };
    if (user) where.organizationId = user.organizationId;

    return this.rtrRepo.find({
      where,
      relations: ['recruiter', 'recruiter.user', 'job', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRTRsByRecruiter(recruiterId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { recruiterId };
    if (user) where.organizationId = user.organizationId;

    return this.rtrRepo.find({
      where,
      relations: ['candidate', 'candidate.user', 'job'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRTRsByJob(jobId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { jobId };
    if (user) where.organizationId = user.organizationId;

    return this.rtrRepo.find({
      where,
      relations: ['candidate', 'candidate.user', 'recruiter', 'recruiter.user'],
      order: { createdAt: 'DESC' },
    });
  }

  private async createHistoryEntry(rtrId: string, action: string, userId: string): Promise<void> {
    // Get the RTR to get the organizationId
    const rtr = await this.rtrRepo.findOne({ where: { id: rtrId } });
    if (!rtr) return;

    const history = this.historyRepo.create({
      rtrId,
      action,
      userId,
      organizationId: rtr.organizationId,
    });

    await this.historyRepo.save(history);
  }

  private async sendRTRNotification(rtr: RTR, candidate: CandidateProfile, recruiter: RecruiterProfile, job: Job | null): Promise<void> {
    try {
      const approvalUrl = `${this.configService.get('FRONTEND_URL')}/rtr/${rtr.id}/approve`;

      await this.emailService.sendRTRNotification(
        candidate.user.email,
        candidate.user.name || 'Candidate',
        recruiter.user.name || 'Recruiter',
        recruiter.organization?.name || 'Company',
        job?.title || 'Position',
        rtr.id,
        approvalUrl,
        rtr.expiresAt || undefined,
      );
    } catch (error) {
      console.error('Failed to send RTR notification:', error);
      // Don't throw error to avoid breaking the RTR creation process
    }
  }

  private async sendRTRStatusUpdate(rtr: RTR, status: string): Promise<void> {
    try {
      const rtrWithRelations = await this.rtrRepo.findOne({
        where: { id: rtr.id },
        relations: ['candidate', 'candidate.user', 'recruiter', 'recruiter.user', 'recruiter.organization'],
      });

      if (rtrWithRelations) {
        await this.emailService.sendRTRStatusUpdate(
          rtrWithRelations.recruiter.user.email,
          rtrWithRelations.recruiter.user.name || 'Recruiter',
          rtrWithRelations.candidate.user.name || 'Candidate',
          rtrWithRelations.recruiter.organization?.name || 'Company',
          status,
          rtr.id,
        );
      }
    } catch (error) {
      console.error('Failed to send RTR status update:', error);
    }
  }

  private isOrganizationAdmin(user: CurrentUser): boolean {
    return [UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN].includes(user.role as any);
  }
}
