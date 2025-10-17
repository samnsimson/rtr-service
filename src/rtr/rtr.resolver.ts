import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RTRService } from './rtr.service';
import { CreateRtrInput, RtrResponse, UpdateRTRInput } from './dto';
import { RTR } from './entities/rtr.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CurrentUser, CurrentUser as CurrentUserType } from '../common/types';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { UsersService } from 'src/users/users.service';
import { JobResponse } from 'src/jobs/dto';
import { JobsService } from 'src/jobs/jobs.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { User } from 'src/users/entities/user.entity';
import { RtrServiceHelper } from './helpers/rtr-service.helper';
import { RecruiterProfileService } from 'src/recruiter-profile/recruiter-profile.service';
import { RtrTemplateService } from 'src/rtr-template/rtr-template.service';
import { RtrTemplateResponse } from 'src/rtr-template/dto/rtr-template.response';
import { RtrFiltersInput } from './dto/rtr-filters.input';

@Resolver(() => RtrResponse)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RTRResolver extends RtrServiceHelper {
  constructor(
    private readonly rtrService: RTRService,
    private readonly jobsService: JobsService,
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
    private readonly recruiterProfileService: RecruiterProfileService,
    private readonly rtrTemplateService: RtrTemplateService,
  ) {
    super();
  }

  @Mutation(() => RtrResponse, { name: 'createRtr' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  async createRTR(@Args('createRtrInput') createRtrInput: CreateRtrInput, @AuthUser() user: CurrentUserType): Promise<RtrResponse> {
    const rtr = await this.rtrService.create(createRtrInput, user);
    return this.toRtrResponse(rtr);
  }

  @Query(() => [RtrResponse], { name: 'rtrs' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  async findAll(
    @AuthUser() user: CurrentUserType,
    @Args('filters', { type: () => RtrFiltersInput, nullable: true }) filters: RtrFiltersInput,
  ): Promise<RtrResponse[]> {
    const rtrs = await this.rtrService.findAll(user, filters);
    return rtrs.map((rtr) => this.toRtrResponse(rtr));
  }

  @Query(() => RtrResponse, { name: 'rtr' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse> {
    const rtr = await this.rtrService.findOne(id, user);
    return this.toRtrResponse(rtr);
  }

  @Mutation(() => RtrResponse, { name: 'updateRTR' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  async updateRTR(
    @Args('id', { type: () => String }) id: string,
    @Args('updateRtrInput') updateRtrInput: UpdateRTRInput,
    @AuthUser() user: CurrentUserType,
  ): Promise<RtrResponse> {
    const rtr = await this.rtrService.update(id, updateRtrInput, user);
    return this.toRtrResponse(rtr);
  }

  @Mutation(() => Boolean, { name: 'removeRtr' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  removeRTR(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<boolean> {
    return this.rtrService.remove(id, user);
  }

  @Mutation(() => RtrResponse, { name: 'approveRtr' })
  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  async approveRTR(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse> {
    const rtr = await this.rtrService.approveRTR(id, user);
    return this.toRtrResponse(rtr);
  }

  @Mutation(() => RtrResponse, { name: 'rejectRtr' })
  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  async rejectRTR(
    @Args('id', { type: () => String }) id: string,
    @Args('reason', { type: () => String }) reason: string,
    @AuthUser() user: CurrentUserType,
  ): Promise<RtrResponse> {
    const rtr = await this.rtrService.rejectRTR(id, reason, user);
    return this.toRtrResponse(rtr);
  }

  @Mutation(() => RtrResponse, { name: 'markRtrAsViewed' })
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  async markRTRAsViewed(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse> {
    const rtr = await this.rtrService.markAsViewed(id, user);
    return this.toRtrResponse(rtr);
  }

  @Query(() => [RtrResponse], { name: 'rtrsByCandidate' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  async getRTRsByCandidate(@Args('candidateId', { type: () => String }) candidateId: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse[]> {
    const rtrs = await this.rtrService.getRTRsByCandidate(candidateId, user);
    return rtrs.map((rtr) => this.toRtrResponse(rtr));
  }

  @Query(() => [RtrResponse], { name: 'rtrsByRecruiter' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  async getRTRsByRecruiter(@Args('recruiterId', { type: () => String }) recruiterId: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse[]> {
    const rtrs = await this.rtrService.getRTRsByRecruiter(recruiterId, user);
    return rtrs.map((rtr) => this.toRtrResponse(rtr));
  }

  @Query(() => [RtrResponse], { name: 'rtrsByJob' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  async getRTRsByJob(@Args('jobId', { type: () => String }) jobId: string, @AuthUser() user: CurrentUserType): Promise<RtrResponse[]> {
    const rtrs = await this.rtrService.getRTRsByJob(jobId, user);
    return rtrs.map((rtr) => this.toRtrResponse(rtr));
  }

  @ResolveField(() => CandidateProfile)
  candidate(@Parent() rtr: RTR): CandidateProfile {
    return rtr.candidate;
  }

  @ResolveField(() => RecruiterProfile)
  async recruiter(@Parent() rtr: RtrResponse, @AuthUser() user: CurrentUser): Promise<RecruiterProfile> {
    return await this.recruiterProfileService.findOne(rtr.recruiterId, user.organizationId);
  }

  @ResolveField(() => JobResponse, { name: 'job' })
  async job(@Parent() rtr: RtrResponse, @AuthUser() user: CurrentUser): Promise<JobResponse> {
    const job = await this.jobsService.findOne(rtr.jobId, user);
    return new JobResponse(job);
  }

  @ResolveField(() => Organization)
  async organization(@Parent() rtr: RtrResponse): Promise<Organization | null> {
    const organization = await this.organizationsService.findOne(rtr.organizationId);
    return organization;
  }

  // @ResolveField(() => [RTRHistory], { nullable: true })
  // history(@Parent() rtr: RtrResponse): RTRHistory[] {
  //   return rtr.history || [];
  // }

  // @ResolveField(() => [Document], { nullable: true })
  // documents(@Parent() rtr: RtrResponse): Document[] {
  //   return rtr.documents || [];
  // }

  @ResolveField(() => User, { name: 'createdBy' })
  async user(@Parent() rtr: RtrResponse): Promise<User | null> {
    const user = await this.usersService.findOne(rtr.createdById);
    return user;
  }

  @ResolveField(() => RtrTemplateResponse, { name: 'rtrTemplate' })
  async rtrTemplate(@Parent() rtr: RtrResponse, @AuthUser() user: CurrentUser): Promise<RtrTemplateResponse> {
    const rtrTemplate = await this.rtrTemplateService.findOne(rtr.rtrTemplateId, user.organizationId);
    return new RtrTemplateResponse(rtrTemplate);
  }
}
