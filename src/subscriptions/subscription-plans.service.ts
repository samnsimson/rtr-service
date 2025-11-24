import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { PlanType } from 'src/common';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan) private readonly planRepo: Repository<SubscriptionPlan>,
    private readonly stripeService: StripeService,
  ) {}

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({ where: { isActive: true }, order: { planType: 'ASC', billingInterval: 'ASC' } });
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Subscription plan not found');
    return plan;
  }

  async findByType(planType: PlanType): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({ where: { planType, isActive: true }, order: { billingInterval: 'ASC' } });
  }

  async createDefaultPlans(): Promise<void> {
    const existingPlans = await this.planRepo.count();
    if (existingPlans > 0) return; // Plans already exist
  }
}
