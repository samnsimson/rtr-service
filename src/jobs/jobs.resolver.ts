import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JobsService } from './jobs.service';
import { CreateJobInput, JobResponse, UpdateJobInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { CurrentUser } from 'src/common/types';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => JobResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER)
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Mutation(() => JobResponse)
  createJob(@Args('createJobInput') createJobInput: CreateJobInput, @AuthUser() user: CurrentUser) {
    return this.jobsService.create(createJobInput, user);
  }

  @Query(() => [JobResponse], { name: 'jobs' })
  findAll(@AuthUser() user: CurrentUser) {
    return this.jobsService.findAll(user);
  }

  @Query(() => JobResponse, { name: 'job' })
  findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    return this.jobsService.findOne(id, user);
  }

  @Mutation(() => JobResponse)
  updateJob(@Args('id', { type: () => String }) id: string, @Args('updateJobInput') updateJobInput: UpdateJobInput, @AuthUser() user: CurrentUser) {
    return this.jobsService.update(id, updateJobInput, user);
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
}
