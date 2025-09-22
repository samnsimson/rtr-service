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

@Resolver(() => Overview)
@UseGuards(JwtAuthGuard)
export class OverviewResolver {
  constructor(private readonly overviewService: OverviewService) {}

  @Query(() => Overview, { name: 'overview', description: 'Get comprehensive overview metrics for an organization' })
  async getOverview(@AuthUser() user: CurrentUser, @Args('query', { type: () => OverviewQueryInput, nullable: true }) query: OverviewQueryInput) {
    return this.overviewService.getOverview(query, user.organizationId);
  }

  @Query(() => Overview, { name: 'overviewByOrganization', description: "Get overview for the authenticated user's organization" })
  async getOverviewByOrganization(@AuthUser() user: CurrentUser) {
    return this.overviewService.findByOrganization(user.organizationId);
  }

  @Query(() => Overview, {
    name: 'overviewMetrics',
    description: "Get basic overview metrics without detailed breakdowns for the authenticated user's organization",
  })
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

  @Query(() => Overview, { name: 'overviewDashboard', description: "Get dashboard overview with all metrics for the authenticated user's organization" })
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

  @Mutation(() => Overview, { description: "Create overview with custom parameters for the authenticated user's organization" })
  createOverview(@Args('createOverviewInput') createOverviewInput: CreateOverviewInput, @AuthUser() user: CurrentUser) {
    if (createOverviewInput.organizationId !== user.organizationId) throw new Error('Organization ID does not match');
    const createInputWithOrgId = { ...createOverviewInput };
    return this.overviewService.create(createInputWithOrgId, user.organizationId);
  }

  @Query(() => [Overview], { name: 'overviews', description: "Get all overview data for the authenticated user's organization" })
  async findAll(@AuthUser() user: CurrentUser) {
    const overviews = await this.overviewService.findAll();
    return overviews.filter((overview) => overview.organizationId === user.organizationId);
  }

  @Query(() => Overview, { name: 'overviewById', description: "Get overview by ID for the authenticated user's organization" })
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    const overview = await this.overviewService.findOne(id);
    if (overview && overview.organizationId !== user.organizationId) {
      throw new Error('Overview not found or access denied');
    }
    return overview;
  }

  @Mutation(() => Overview, { description: "Update overview parameters for the authenticated user's organization" })
  updateOverview(@Args('updateOverviewInput') updateOverviewInput: UpdateOverviewInput, @AuthUser() user: CurrentUser) {
    const updateInputWithOrgId = { ...updateOverviewInput };
    return this.overviewService.update(updateOverviewInput.id, updateInputWithOrgId, user.organizationId);
  }

  @Mutation(() => Overview, { description: "Remove overview for the authenticated user's organization" })
  async removeOverview(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    const overview = await this.overviewService.findOne(id);
    if (overview && overview.organizationId !== user.organizationId) throw new Error('Overview not found or access denied');
    return await this.overviewService.remove(id);
  }

  @Mutation(() => Overview, { description: "Refresh overview data for the authenticated user's organization" })
  refreshOverview(@AuthUser() user: CurrentUser) {
    return this.overviewService.refreshOverview(user.organizationId);
  }

  @Mutation(() => Boolean, { description: "Delete overview data for the authenticated user's organization" })
  deleteOverview(@AuthUser() user: CurrentUser) {
    return this.overviewService.deleteOverview(user.organizationId);
  }
}
