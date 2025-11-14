import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { JobResponse, JobResponsePaginated, UpdateJobInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { CurrentUser } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthUser } from 'src/common/decorators/current-user.decorator';
import { CreateJobInput } from './dto/create-job.input';
import { JobListFiltersInput } from './dto/job-list-filters.input';
import { User } from 'src/users/entities/user.entity';
import { Job } from './entities/job.entity';
import { UsersService } from 'src/users/users.service';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { RecruiterProfileService } from 'src/recruiter-profile/recruiter-profile.service';

@Resolver(() => JobResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER)
export class JobsResolver {
  constructor(
    private readonly jobsService: JobsService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    private readonly recruiterProfileService: RecruiterProfileService,
  ) {}

  @Mutation(() => JobResponse)
  createJob(@Args('createJobInput') createJobInput: CreateJobInput, @AuthUser() user: CurrentUser) {
    return this.jobsService.create(createJobInput, user);
  }

  @Query(() => JobResponsePaginated, { name: 'jobs' })
  async findAll(@AuthUser() user: CurrentUser, @Args('filters', { type: () => JobListFiltersInput }) filters: JobListFiltersInput) {
    const [data, total] = await this.jobsService.findAll(user, filters);
    return new JobResponsePaginated({ data, total, ...filters });
  }

  @Query(() => JobResponse, { name: 'job' })
  findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    return this.jobsService.findOne(id, user);
  }

  @Mutation(() => JobResponse)
  updateJob(@Args('updateJobInput') updateJobInput: UpdateJobInput, @AuthUser() user: CurrentUser) {
    return this.jobsService.update(updateJobInput.id, updateJobInput, user);
  }

  @Mutation(() => JobResponse)
  removeJob(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    return this.jobsService.remove(id, user);
  }

  @Query(() => [JobResponse], { name: 'jobsByOrganization' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  findJobsByOrganization(@Args('organizationId', { type: () => String }) organizationId: string) {
    return this.jobsService.findJobsByOrganization(organizationId);
  }

  @Query(() => [JobResponse], { name: 'jobsByRecruiter' })
  findJobsByRecruiter(@Args('recruiterId', { type: () => String }) recruiterId: string, @AuthUser() user: CurrentUser) {
    return this.jobsService.findJobsByRecruiter(recruiterId, user);
  }

  @ResolveField(() => User, { name: 'recruiter' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER)
  async findRecruiter(@Parent() job: Job, @AuthUser() user: CurrentUser) {
    const recruiter = await this.recruiterProfileService.findOne(job.recruiterId, user.organizationId);
    return this.usersService.findOne(job.recruiterId, { where: { id: recruiter.userId } });
  }

  @ResolveField(() => Organization, { name: 'organization' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER)
  findOrganization(@Parent() job: Job) {
    return this.organizationsService.findOne(job.organizationId);
  }
}
