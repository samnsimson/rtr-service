import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan, PlanType } from './entities/subscription-plan.entity';
import { DEFAULT_SUBSCRIPTION_PLANS } from '../common/constants';

@Injectable()
export class SubscriptionPlansService {
  constructor(@InjectRepository(SubscriptionPlan) private readonly planRepo: Repository<SubscriptionPlan>) {}

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
    const plans = this.planRepo.create(DEFAULT_SUBSCRIPTION_PLANS);
    await this.planRepo.save(plans);
  }
}
