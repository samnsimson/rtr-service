import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OverviewService } from './overview.service';
import { Overview } from './entities/overview.entity';
import { CreateOverviewInput } from './dto/create-overview.input';
import { UpdateOverviewInput } from './dto/update-overview.input';
import { OverviewQueryInput } from './dto/overview-query.input';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CurrentUser } from '../common/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@Resolver(() => Overview)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER)
export class OverviewResolver {
  constructor(private readonly overviewService: OverviewService) {}

  @Query(() => Overview, { name: 'overview' })
  async getOverview(@AuthUser() user: CurrentUser, @Args('query', { type: () => OverviewQueryInput, nullable: true }) query: OverviewQueryInput) {
    return this.overviewService.getOverview(query, user.organizationId);
  }

  @Query(() => Overview, { name: 'overviewByOrganization' })
  async getOverviewByOrganization(@AuthUser() user: CurrentUser) {
    return this.overviewService.findByOrganization(user.organizationId);
  }

  @Query(() => Overview, { name: 'overviewMetrics' })
  async getOverviewMetrics(@AuthUser() user: CurrentUser) {
    return this.overviewService.getOverview(
      {
        includeDetailedBreakdowns: false,
        includeMonthlyMetrics: false,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      },
      user.organizationId,
    );
  }

  @Query(() => Overview, { name: 'overviewDashboard' })
  async getOverviewDashboard(@AuthUser() user: CurrentUser) {
    return this.overviewService.getOverview(
      {
        includeDetailedBreakdowns: true,
        includeMonthlyMetrics: true,
        includeRtrMetrics: true,
        includeJobMetrics: true,
        includeApplicationMetrics: true,
        includeUserMetrics: true,
      },
      user.organizationId,
    );
  }

  @Mutation(() => Overview, { name: 'createOverview' })
  createOverview(@Args('createOverviewInput') createOverviewInput: CreateOverviewInput, @AuthUser() user: CurrentUser) {
    if (createOverviewInput.organizationId !== user.organizationId) throw new Error('Organization ID does not match');
    const createInputWithOrgId = { ...createOverviewInput };
    return this.overviewService.create(createInputWithOrgId, user.organizationId);
  }

  @Query(() => [Overview], { name: 'overviews' })
  async findAll(@AuthUser() user: CurrentUser) {
    const overviews = await this.overviewService.findAll();
    return overviews.filter((overview) => overview.organizationId === user.organizationId);
  }

  @Query(() => Overview, { name: 'overviewById' })
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    const overview = await this.overviewService.findOne(id);
    if (overview && overview.organizationId !== user.organizationId) {
      throw new Error('Overview not found or access denied');
    }
    return overview;
  }

  @Mutation(() => Overview, { name: 'updateOverview' })
  updateOverview(@Args('updateOverviewInput') updateOverviewInput: UpdateOverviewInput, @AuthUser() user: CurrentUser) {
    const updateInputWithOrgId = { ...updateOverviewInput };
    return this.overviewService.update(updateOverviewInput.id, updateInputWithOrgId, user.organizationId);
  }

  @Mutation(() => Overview, { name: 'removeOverview' })
  async removeOverview(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    const overview = await this.overviewService.findOne(id);
    if (overview && overview.organizationId !== user.organizationId) throw new Error('Overview not found or access denied');
    return await this.overviewService.remove(id);
  }

  @Mutation(() => Overview, { name: 'refreshOverview' })
  refreshOverview(@AuthUser() user: CurrentUser) {
    return this.overviewService.refreshOverview(user.organizationId);
  }

  @Mutation(() => Boolean, { name: 'deleteOverview' })
  deleteOverview(@AuthUser() user: CurrentUser) {
    return this.overviewService.deleteOverview(user.organizationId);
  }
}
