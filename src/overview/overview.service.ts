import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Overview } from './entities/overview.entity';
import { CreateOverviewInput } from './dto/create-overview.input';
import { UpdateOverviewInput } from './dto/update-overview.input';
import { OverviewQueryInput } from './dto/overview-query.input';
import { RTRStatus, JobStatus, ApplicationStatus } from '../common/enums';
import { RTRService } from '../rtr/rtr.service';
import { JobsService } from '../jobs/jobs.service';
import { JobApplicationsService } from '../job-applications/job-applications.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(Overview) private readonly overviewRepo: Repository<Overview>,
    private readonly rtrService: RTRService,
    private readonly jobsService: JobsService,
    private readonly jobApplicationsService: JobApplicationsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async getOverview(query: OverviewQueryInput, organizationId: string): Promise<Overview> {
    const {
      includeMonthlyMetrics = true,
      includeDetailedBreakdowns = true,
      includeRtrMetrics = true,
      includeJobMetrics = true,
      includeApplicationMetrics = true,
      includeUserMetrics = true,
    } = query;

    await this.organizationsService.findOne(organizationId);
    let overview = await this.overviewRepo.findOne({ where: { organizationId }, relations: ['organization'] });
    if (!overview) overview = await this.createDefaultOverview(organizationId);

    await this.updateOverviewData(overview, {
      includeMonthlyMetrics,
      includeDetailedBreakdowns,
      includeRtrMetrics,
      includeJobMetrics,
      includeApplicationMetrics,
      includeUserMetrics,
    });

    return overview;
  }

  async createDefaultOverview(organizationId: string): Promise<Overview> {
    const overview = this.overviewRepo.create({
      organizationId,
      totalRtrs: 0,
      pendingRtrs: 0,
      signedRtrs: 0,
      expiredRtrs: 0,
      rejectedRtrs: 0,
      totalCandidates: 0,
      totalRecruiters: 0,
      totalOrganizations: 1, // This organization
      totalJobs: 0,
      activeJobs: 0,
      closedJobs: 0,
      totalJobApplications: 0,
      reviewingApplications: 0,
      interviewingApplications: 0,
      acceptedApplications: 0,
      rejectedApplications: 0,
      totalUsers: 0,
      rtrsThisMonth: 0,
      jobsThisMonth: 0,
      applicationsThisMonth: 0,
    });

    return this.overviewRepo.save(overview);
  }

  private async updateOverviewData(
    overview: Overview,
    options: {
      includeMonthlyMetrics: boolean;
      includeDetailedBreakdowns: boolean;
      includeRtrMetrics: boolean;
      includeJobMetrics: boolean;
      includeApplicationMetrics: boolean;
      includeUserMetrics: boolean;
    },
  ): Promise<void> {
    const { organizationId } = overview;

    // RTR Metrics
    if (options.includeRtrMetrics) {
      overview.totalRtrs = await this.getRtrCount(organizationId);

      if (options.includeDetailedBreakdowns) {
        overview.pendingRtrs = await this.getRtrCountByStatus(organizationId, RTRStatus.PENDING);
        overview.signedRtrs = await this.getRtrCountByStatus(organizationId, RTRStatus.SIGNED);
        overview.expiredRtrs = await this.getRtrCountByStatus(organizationId, RTRStatus.EXPIRED);
        overview.rejectedRtrs = await this.getRtrCountByStatus(organizationId, RTRStatus.REJECTED);
      }

      if (options.includeMonthlyMetrics) {
        overview.rtrsThisMonth = await this.getRtrCountThisMonth(organizationId);
      }
    }

    // Job Metrics
    if (options.includeJobMetrics) {
      overview.totalJobs = await this.getJobCount(organizationId);

      if (options.includeDetailedBreakdowns) {
        overview.activeJobs = await this.getJobCountByStatus(organizationId, JobStatus.ACTIVE);
        overview.closedJobs = await this.getJobCountByStatus(organizationId, JobStatus.CLOSED);
      }

      if (options.includeMonthlyMetrics) {
        overview.jobsThisMonth = await this.getJobCountThisMonth(organizationId);
      }
    }

    // Application Metrics
    if (options.includeApplicationMetrics) {
      overview.totalJobApplications = await this.getJobApplicationCount(organizationId);

      if (options.includeDetailedBreakdowns) {
        overview.reviewingApplications = await this.getJobApplicationCountByStatus(organizationId, ApplicationStatus.REVIEWING);
        overview.interviewingApplications = await this.getJobApplicationCountByStatus(organizationId, ApplicationStatus.INTERVIEWING);
        overview.acceptedApplications = await this.getJobApplicationCountByStatus(organizationId, ApplicationStatus.ACCEPTED);
        overview.rejectedApplications = await this.getJobApplicationCountByStatus(organizationId, ApplicationStatus.REJECTED);
      }

      if (options.includeMonthlyMetrics) {
        overview.applicationsThisMonth = await this.getJobApplicationCountThisMonth(organizationId);
      }
    }

    // User Metrics (organization-specific)
    if (options.includeUserMetrics) {
      const userStats = await this.getUserStats(organizationId);
      overview.totalUsers = userStats.totalUsers;
      overview.totalRecruiters = userStats.totalRecruiters;
      overview.totalCandidates = userStats.totalCandidates;
      overview.totalOrganizations = 1; // This organization
    }

    // Save updated overview
    await this.overviewRepo.save(overview);
  }

  async create(createOverviewInput: CreateOverviewInput, organizationId: string) {
    const { includeMonthlyMetrics, includeDetailedBreakdowns } = createOverviewInput;
    return this.getOverview(
      {
        includeMonthlyMetrics,
        includeDetailedBreakdowns,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      },
      organizationId,
    );
  }

  async findAll() {
    return this.overviewRepo.find({ relations: ['organization'] });
  }

  async findOne(id: string) {
    const overview = await this.overviewRepo.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!overview) {
      throw new NotFoundException('Overview not found');
    }
    return overview;
  }

  async findByOrganization(organizationId: string) {
    return this.getOverview(
      {
        includeMonthlyMetrics: true,
        includeDetailedBreakdowns: true,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      },
      organizationId,
    );
  }

  async update(id: string, updateOverviewInput: UpdateOverviewInput, organizationId: string) {
    const { includeMonthlyMetrics, includeDetailedBreakdowns } = updateOverviewInput;
    return this.getOverview(
      {
        includeMonthlyMetrics: includeMonthlyMetrics ?? true,
        includeDetailedBreakdowns: includeDetailedBreakdowns ?? true,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      },
      organizationId,
    );
  }

  async remove(id: string) {
    const overview = await this.findOne(id);
    await this.overviewRepo.remove(overview);
    return overview;
  }

  // Helper methods that use services instead of direct repository access
  private async getRtrCount(organizationId: string): Promise<number> {
    return this.rtrService.countByOrganization(organizationId);
  }

  private async getRtrCountByStatus(organizationId: string, status: RTRStatus): Promise<number> {
    return this.rtrService.countByOrganizationAndStatus(organizationId, status);
  }

  private async getRtrCountThisMonth(organizationId: string): Promise<number> {
    return this.rtrService.countByOrganizationThisMonth(organizationId);
  }

  private getJobCount(organizationId: string): Promise<number> {
    return this.jobsService.countByOrganization(organizationId);
  }

  private getJobCountByStatus(organizationId: string, status: JobStatus): Promise<number> {
    return this.jobsService.countByOrganizationAndStatus(organizationId, status);
  }

  private getJobCountThisMonth(organizationId: string): Promise<number> {
    return this.jobsService.countByOrganizationThisMonth(organizationId);
  }

  private getJobApplicationCount(organizationId: string): Promise<number> {
    return this.jobApplicationsService.countByOrganization(organizationId);
  }

  private getJobApplicationCountByStatus(organizationId: string, status: ApplicationStatus): Promise<number> {
    return this.jobApplicationsService.countByOrganizationAndStatus(organizationId, status);
  }

  private getJobApplicationCountThisMonth(organizationId: string): Promise<number> {
    return this.jobApplicationsService.countByOrganizationThisMonth(organizationId);
  }

  private getUserStats(organizationId: string): Promise<{
    totalUsers: number;
    totalRecruiters: number;
    totalCandidates: number;
  }> {
    return this.organizationsService.getOrganizationStatsForOverview(organizationId);
  }

  /**
   * Refresh overview data for an organization
   * Recalculates all metrics with current data
   */
  async refreshOverview(organizationId: string): Promise<Overview> {
    try {
      // Verify organization exists
      await this.organizationsService.findOne(organizationId);

      // Find existing overview or create default one
      let overview = await this.overviewRepo.findOne({ where: { organizationId } });
      if (!overview) {
        overview = await this.createDefaultOverview(organizationId);
      }

      // Update all overview data with fresh calculations
      await this.updateOverviewData(overview, {
        includeMonthlyMetrics: true,
        includeDetailedBreakdowns: true,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      });

      return overview;
    } catch (error) {
      throw new Error(`Failed to refresh overview for organization ${organizationId}: ${error.message}`);
    }
  }

  /**
   * Delete overview data for an organization
   * Used when organization is deleted
   */
  async deleteOverview(organizationId: string): Promise<boolean> {
    try {
      const result = await this.overviewRepo.delete({ organizationId });
      return (result.affected ?? 0) > 0;
    } catch (error) {
      throw new Error(`Failed to delete overview for organization ${organizationId}: ${error.message}`);
    }
  }
}
