import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RTRService } from './rtr.service';
import { CreateRTRInput, UpdateRTRInput } from './dto';
import { RTR } from './entities/rtr.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../common/types';
import { CandidateProfile } from '../candidate-profile/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter-profile/entities/recruiter-profile.entity';
import { Job } from '../jobs/entities/job.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { RTRHistory } from '../rtr-history/entities/rtr-history.entity';
import { Document } from '../documents/entities/document.entity';
import { User } from '../users/entities/user.entity';

@Resolver(() => RTR)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RTRResolver {
  constructor(private readonly rtrService: RTRService) {}

  @Mutation(() => RTR, { name: 'createRTR' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  createRTR(@Args('createRtrInput') createRtrInput: CreateRTRInput, @AuthUser() user: CurrentUserType): Promise<RTR> {
    return this.rtrService.create(createRtrInput, user);
  }

  @Query(() => [RTR], { name: 'rtrs' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  findAll(@AuthUser() user: CurrentUserType): Promise<RTR[]> {
    return this.rtrService.findAll(user);
  }

  @Query(() => RTR, { name: 'rtr' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RTR> {
    return this.rtrService.findOne(id, user);
  }

  @Mutation(() => RTR, { name: 'updateRTR' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  updateRTR(
    @Args('id', { type: () => String }) id: string,
    @Args('updateRtrInput') updateRtrInput: UpdateRTRInput,
    @AuthUser() user: CurrentUserType,
  ): Promise<RTR> {
    return this.rtrService.update(id, updateRtrInput, user);
  }

  @Mutation(() => Boolean, { name: 'removeRTR' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  removeRTR(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<boolean> {
    return this.rtrService.remove(id, user);
  }

  @Mutation(() => RTR, { name: 'approveRTR' })
  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  approveRTR(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RTR> {
    return this.rtrService.approveRTR(id, user);
  }

  @Mutation(() => RTR, { name: 'rejectRTR' })
  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  rejectRTR(
    @Args('id', { type: () => String }) id: string,
    @Args('reason', { type: () => String }) reason: string,
    @AuthUser() user: CurrentUserType,
  ): Promise<RTR> {
    return this.rtrService.rejectRTR(id, reason, user);
  }

  @Mutation(() => RTR, { name: 'markRTRAsViewed' })
  @Roles(UserRole.CANDIDATE, UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  markRTRAsViewed(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<RTR> {
    return this.rtrService.markAsViewed(id, user);
  }

  @Query(() => [RTR], { name: 'rtrsByCandidate' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN, UserRole.CANDIDATE)
  getRTRsByCandidate(@Args('candidateId', { type: () => String }) candidateId: string, @AuthUser() user: CurrentUserType): Promise<RTR[]> {
    return this.rtrService.getRTRsByCandidate(candidateId, user);
  }

  @Query(() => [RTR], { name: 'rtrsByRecruiter' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  getRTRsByRecruiter(@Args('recruiterId', { type: () => String }) recruiterId: string, @AuthUser() user: CurrentUserType): Promise<RTR[]> {
    return this.rtrService.getRTRsByRecruiter(recruiterId, user);
  }

  @Query(() => [RTR], { name: 'rtrsByJob' })
  @Roles(UserRole.RECRUITER, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER_MANAGER, UserRole.ADMIN)
  getRTRsByJob(@Args('jobId', { type: () => String }) jobId: string, @AuthUser() user: CurrentUserType): Promise<RTR[]> {
    return this.rtrService.getRTRsByJob(jobId, user);
  }

  @ResolveField(() => CandidateProfile)
  candidate(@Parent() rtr: RTR): CandidateProfile {
    return rtr.candidate;
  }

  @ResolveField(() => RecruiterProfile)
  recruiter(@Parent() rtr: RTR): RecruiterProfile {
    return rtr.recruiter;
  }

  @ResolveField(() => Job, { nullable: true })
  job(@Parent() rtr: RTR): Job | null {
    return rtr.job || null;
  }

  @ResolveField(() => Organization, { nullable: true })
  organization(@Parent() rtr: RTR): Organization | null {
    return rtr.organization || null;
  }

  @ResolveField(() => [RTRHistory], { nullable: true })
  history(@Parent() rtr: RTR): RTRHistory[] {
    return rtr.history || [];
  }

  @ResolveField(() => [Document], { nullable: true })
  documents(@Parent() rtr: RTR): Document[] {
    return rtr.documents || [];
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() rtr: RTR): User | null {
    return rtr.user || null;
  }
}
