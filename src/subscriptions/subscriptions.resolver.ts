import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../common/types';

@Resolver(() => Subscription)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Mutation(() => Subscription, { name: 'createSubscription' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async createSubscription(
    @Args('createSubscriptionInput') createSubscriptionInput: CreateSubscriptionInput,
    @AuthUser() user: CurrentUserType,
  ): Promise<Subscription> {
    return this.subscriptionsService.createSubscription(createSubscriptionInput, user);
  }

  @Query(() => [Subscription], { name: 'subscriptions' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async findAll(@AuthUser() user: CurrentUserType): Promise<Subscription[]> {
    return this.subscriptionsService.findAll(user);
  }

  @Query(() => Subscription, { name: 'subscription' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<Subscription> {
    return this.subscriptionsService.findOne(id, user);
  }

  @Mutation(() => Subscription, { name: 'updateSubscription' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async updateSubscription(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput,
    @AuthUser() user: CurrentUserType,
  ): Promise<Subscription> {
    return this.subscriptionsService.update(id, updateSubscriptionInput, user);
  }

  @Mutation(() => Subscription, { name: 'cancelSubscription' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async cancelSubscription(
    @Args('id', { type: () => String }) id: string,
    @AuthUser() user: CurrentUserType,
    @Args('reason', { type: () => String, nullable: true }) reason?: string,
  ): Promise<Subscription> {
    return this.subscriptionsService.cancel(id, reason, user);
  }

  @Query(() => Subscription, { name: 'activeSubscription', nullable: true })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async getActiveSubscription(@AuthUser() user: CurrentUserType): Promise<Subscription | null> {
    return this.subscriptionsService.getActiveSubscription(user.id);
  }

  @Query(() => [Subscription], { name: 'organizationSubscriptions' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async getOrganizationSubscriptions(@Args('organizationId', { type: () => String }) organizationId: string): Promise<Subscription[]> {
    return this.subscriptionsService.getOrganizationSubscriptions(organizationId);
  }

  @ResolveField(() => SubscriptionPlan)
  plan(@Parent() subscription: Subscription): SubscriptionPlan {
    return subscription.plan;
  }
}
