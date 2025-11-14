import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { PlanType } from 'src/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => SubscriptionPlan)
@UseGuards(JwtAuthGuard)
export class SubscriptionPlansResolver {
  constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

  @Query(() => [SubscriptionPlan], { name: 'subscriptionPlans' })
  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlansService.findAll();
  }

  @Query(() => SubscriptionPlan, { name: 'subscriptionPlan' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<SubscriptionPlan> {
    return this.subscriptionPlansService.findOne(id);
  }

  @Query(() => [SubscriptionPlan], { name: 'subscriptionPlansByType' })
  async findByType(@Args('planType', { type: () => PlanType }) planType: PlanType): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlansService.findByType(planType);
  }
}
