import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RTR } from './entities/rtr.entity';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { RTRHistory } from '../rtr-history/entities/rtr-history.entity';
import { CreateRtrInput, UpdateRTRInput } from './dto';
import { JobStatus, RTRStatus, UserRole } from '../common/enums';
import { CurrentUser } from '../common/types';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { RecruiterProfileService } from 'src/recruiter-profile/recruiter-profile.service';
import { JobsService } from 'src/jobs/jobs.service';
import { CandidateProfileService } from 'src/candidate-profile/candidate-profile.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { RtrTemplateService } from 'src/rtr-template/rtr-template.service';
import { RtrServiceHelper } from './helpers/rtr-service.helper';
import { JobResponse } from 'src/jobs/dto';
import { add } from 'date-fns';

@Injectable()
export class RTRService extends RtrServiceHelper {
  constructor(
    private readonly jobsService: JobsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly rtrTemplateService: RtrTemplateService,
    private readonly organizationsService: OrganizationsService,
    private readonly candidateProfileService: CandidateProfileService,
    private readonly recruiterProfileService: RecruiterProfileService,
    @InjectRepository(RTR) private readonly rtrRepo: Repository<RTR>,
    @InjectRepository(RTRHistory) private readonly historyRepo: Repository<RTRHistory>,
  ) {
    super();
  }

  async create(createRtrInput: CreateRtrInput, user: CurrentUser): Promise<RTR> {
    const { firstName, lastName, email, phone } = createRtrInput;
    const { jobId, notes, expiresAt, compensation, compensationType, rtrTemplateId } = createRtrInput;
    const { resumeRequired, photoIdRequired, employerDetailsRequired, referencesRequired, skillsRequired } = createRtrInput;

    const candidateCall = this.candidateProfileService.findOneWhere({ user: { email } }, user);
    const recruiterCall = this.recruiterProfileService.findOneByUserId(user.id, user);
    const jobCall = this.jobsService.findOne(jobId, user, { status: JobStatus.ACTIVE });
    const organizationCall = this.organizationsService.findOne(user.organizationId);
    const rtrTemplateCall = this.rtrTemplateService.findOne(rtrTemplateId, user.organizationId);
    const response = await Promise.all([jobCall, candidateCall, recruiterCall, organizationCall, rtrTemplateCall]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [job, candidate, recruiter, organization, rtrTemplate] = response;
    if (!job) throw new NotFoundException('Job not found or is not active');

    // Create RTR
    const rtr = this.rtrRepo.create({
      notes,
      compensation,
      compensationType,
      candidateFirstName: firstName,
      candidateLastName: lastName,
      candidateEmail: email,
      candidatePhone: phone,
      job: job,
      organization: organization,
      expiresAt: expiresAt ? new Date(expiresAt) : add(new Date(), { days: 30 }),
      recruiter: recruiter,
      rtrTemplate: rtrTemplate,
      createdBy: { id: user.id },
      resumeRequired,
      photoIdRequired,
      employerDetailsRequired,
      referencesRequired,
      skillsRequired,
    });

    return await this.rtrRepo.save(rtr);
  }

  async findAll(user: CurrentUser, options?: FindOptionsWhere<RTR>): Promise<RTR[]> {
    const where: FindOptionsWhere<RTR> = { organization: { id: user.organizationId }, ...options };
    return this.rtrRepo.find({ where, relations: ['candidate', 'recruiter', 'job', 'rtrTemplate', 'organization', 'createdBy'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user: CurrentUser): Promise<RTR> {
    const where: FindOptionsWhere<RTR> = { id, organization: { id: user.organizationId } };
    const rtr = await this.rtrRepo.findOne({ where, relations: ['candidate', 'recruiter', 'job', 'rtrTemplate', 'organization', 'createdBy'] });
    if (!rtr) throw new NotFoundException('RTR not found');
    return rtr;
  }

  async update(id: string, updateRtrInput: UpdateRTRInput, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);
    if (rtr.recruiter.id !== user.id && !this.isOrganizationAdmin(user)) throw new ForbiddenException('You can only update RTRs you created');
    const oldStatus = rtr.status;
    Object.assign(rtr, updateRtrInput);
    if (updateRtrInput.expiresAt) rtr.expiresAt = new Date(updateRtrInput.expiresAt);
    const savedRTR = await this.rtrRepo.save(rtr);
    if (oldStatus !== savedRTR.status) await this.createHistoryEntry(savedRTR.id, `Status changed from ${oldStatus} to ${savedRTR.status}`, user);
    return this.findOne(savedRTR.id, user);
  }

  async remove(id: string, user: CurrentUser): Promise<boolean> {
    const rtr = await this.findOne(id, user);
    if (rtr.recruiter.id !== user.id && !this.isOrganizationAdmin(user)) throw new ForbiddenException('You can only delete RTRs you created');
    await this.rtrRepo.remove(rtr);
    return true;
  }

  async approveRTR(id: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);
    if (rtr.status !== RTRStatus.PENDING) throw new BadRequestException('Only pending RTRs can be approved');
    rtr.status = RTRStatus.SIGNED;
    rtr.signedAt = new Date();
    rtr.viewedAt = new Date();
    const savedRTR = await this.rtrRepo.save(rtr);
    await this.createHistoryEntry(savedRTR.id, 'RTR approved by candidate', user);
    await this.sendRTRStatusUpdate(savedRTR, 'approved');
    return this.findOne(savedRTR.id, user);
  }

  async rejectRTR(id: string, reason: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);
    if (rtr.status !== RTRStatus.PENDING) throw new BadRequestException('Only pending RTRs can be rejected');
    rtr.status = RTRStatus.REJECTED;
    rtr.notes = rtr.notes ? `${rtr.notes}\nRejection reason: ${reason}` : `Rejection reason: ${reason}`;
    rtr.viewedAt = new Date();

    const savedRTR = await this.rtrRepo.save(rtr);
    await this.createHistoryEntry(savedRTR.id, `RTR rejected by candidate. Reason: ${reason}`, user);
    await this.sendRTRStatusUpdate(savedRTR, 'rejected');
    return this.findOne(savedRTR.id, user);
  }

  async markAsViewed(id: string, user: CurrentUser): Promise<RTR> {
    const rtr = await this.findOne(id, user);
    if (rtr.viewedAt) return rtr;
    rtr.viewedAt = new Date();
    return await this.rtrRepo.save(rtr);
  }

  async getRTRsByCandidate(candidateId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { candidateId };
    if (user) where.organizationId = user.organizationId;
    return this.rtrRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getRTRsByRecruiter(recruiterId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { recruiterId };
    if (user) where.organizationId = user.organizationId;
    return this.rtrRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getRTRsByJob(jobId: string, user?: CurrentUser): Promise<RTR[]> {
    const where: any = { jobId };
    if (user) where.organizationId = user.organizationId;
    return this.rtrRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  private async createHistoryEntry(rtrId: string, action: string, user: CurrentUser): Promise<void> {
    const rtr = await this.findOne(rtrId, user);
    const history = this.historyRepo.create({ rtrId, action, userId: user.id, organizationId: rtr.organization.id });
    await this.historyRepo.save(history);
  }

  private sendRTRNotification(rtr: RTR, candidate: CandidateProfile, recruiter: RecruiterProfile, job: JobResponse | null) {
    try {
      const approvalUrl = `${this.configService.get('FRONTEND_URL')}/rtr/${rtr.id}/approve`;
      this.emailService.sendRTRNotification(
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
        this.emailService.sendRTRStatusUpdate(
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
