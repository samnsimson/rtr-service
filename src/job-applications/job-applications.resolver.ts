import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import { CreateJobApplicationInput, UpdateJobApplicationInput } from './dto';
import { JobApplication } from './entities/job-application.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/types';

@Resolver(() => JobApplication)
export class JobApplicationsResolver {
  constructor(private readonly jobApplicationsService: JobApplicationsService) {}

  @Mutation(() => JobApplication, { name: 'createJobApplication' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async createJobApplication(
    @Args('createJobApplicationInput') createJobApplicationInput: CreateJobApplicationInput,
    @AuthUser() user: CurrentUser,
  ): Promise<JobApplication> {
    return this.jobApplicationsService.create(createJobApplicationInput, user);
  }

  @Query(() => [JobApplication], { name: 'jobApplications' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async findAll(@AuthUser() user: CurrentUser): Promise<JobApplication[]> {
    return this.jobApplicationsService.findAll(user);
  }

  @Query(() => JobApplication, { name: 'jobApplication' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser): Promise<JobApplication> {
    return this.jobApplicationsService.findOne(id, user);
  }

  @Mutation(() => JobApplication, { name: 'updateJobApplication' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async updateJobApplication(
    @Args('id', { type: () => String }) id: string,
    @Args('updateJobApplicationInput') updateJobApplicationInput: UpdateJobApplicationInput,
    @AuthUser() user: CurrentUser,
  ): Promise<JobApplication> {
    return this.jobApplicationsService.update(id, updateJobApplicationInput, user);
  }

  @Mutation(() => JobApplication, { name: 'removeJobApplication' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async removeJobApplication(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser): Promise<JobApplication> {
    return this.jobApplicationsService.remove(id, user);
  }

  @Query(() => [JobApplication], { name: 'jobApplicationsByJob' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async findByJob(@Args('jobId', { type: () => String }) jobId: string, @AuthUser() user: CurrentUser): Promise<JobApplication[]> {
    return this.jobApplicationsService.findByJob(jobId, user);
  }

  @Query(() => [JobApplication], { name: 'jobApplicationsByCandidate' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async findByCandidate(@Args('candidateId', { type: () => String }) candidateId: string, @AuthUser() user: CurrentUser): Promise<JobApplication[]> {
    return this.jobApplicationsService.findByCandidate(candidateId, user);
  }

  @Query(() => String, { name: 'applicationStats' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER, UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async getApplicationStats(@AuthUser() user: CurrentUser): Promise<string> {
    const stats = await this.jobApplicationsService.getApplicationStats(user);
    return JSON.stringify(stats);
  }

  // Resolve fields for relations
  @ResolveField(() => String, { name: 'job' })
  getJob(@Parent() application: JobApplication): string {
    return application.jobId;
  }

  @ResolveField(() => String, { name: 'candidate' })
  getCandidate(@Parent() application: JobApplication): string {
    return application.candidateId;
  }

  @ResolveField(() => String, { name: 'organization', nullable: true })
  getOrganization(@Parent() application: JobApplication): string | null {
    return application.organizationId;
  }
}
