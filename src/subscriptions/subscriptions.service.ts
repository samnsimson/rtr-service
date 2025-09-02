import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from './dto';
import { CurrentUser } from '../common/types';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan) private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
  ) {}

  async createSubscription(createSubscriptionInput: CreateSubscriptionInput, user: CurrentUser): Promise<Subscription> {
    const { planId, organizationId, billingInterval, autoRenew = true } = createSubscriptionInput;

    // Get the plan
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Subscription plan not found');

    // Check if user already has an active subscription
    const existingSubscription = await this.subscriptionRepo.findOne({ where: { userId: user.id, status: SubscriptionStatus.ACTIVE } });
    if (existingSubscription) throw new ConflictException('User already has an active subscription');

    // If organizationId is provided, verify user has access to it
    if (organizationId) {
      const organization = await this.orgRepo.findOne({ where: { id: organizationId } });
      if (!organization) throw new NotFoundException('Organization not found');
      if (organization.id !== user.organizationId) throw new BadRequestException('User does not belong to this organization');
    }

    const subscription = this.subscriptionRepo.create({
      userId: user.id,
      organizationId: organizationId || user.organizationId,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: this.calculateEndDate(billingInterval),
      nextBillingDate: this.calculateNextBillingDate(billingInterval),
      autoRenew,
      amount: plan.price,
      currency: plan.currency,
      planType: plan.planType,
      billingInterval: plan.billingInterval,
    });

    return this.subscriptionRepo.save(subscription);
  }

  async findAll(user?: CurrentUser): Promise<Subscription[]> {
    const where: any = {};
    if (user) where.userId = user.id;
    return this.subscriptionRepo.find({ where, relations: ['plan', 'user', 'organization'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user?: CurrentUser): Promise<Subscription> {
    const where: any = { id };
    if (user) where.userId = user.id;

    const subscription = await this.subscriptionRepo.findOne({ where, relations: ['plan', 'user', 'organization', 'payments'] });

    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }

  async update(id: string, updateSubscriptionInput: UpdateSubscriptionInput, user: CurrentUser): Promise<Subscription> {
    const subscription = await this.findOne(id, user);
    Object.assign(subscription, updateSubscriptionInput);
    if (updateSubscriptionInput.cancelledAt) subscription.cancelledAt = new Date(updateSubscriptionInput.cancelledAt);
    return this.subscriptionRepo.save(subscription);
  }

  async cancel(id: string, reason?: string, user?: CurrentUser): Promise<Subscription> {
    const subscription = await this.findOne(id, user);
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = reason;
    subscription.autoRenew = false;
    return this.subscriptionRepo.save(subscription);
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({ where: { userId, status: SubscriptionStatus.ACTIVE }, relations: ['plan'] });
  }

  async getOrganizationSubscriptions(organizationId: string): Promise<Subscription[]> {
    return this.subscriptionRepo.find({ where: { organizationId }, relations: ['plan', 'user'], order: { createdAt: 'DESC' } });
  }

  private calculateEndDate(billingInterval: string): Date {
    const endDate = new Date();
    if (billingInterval === 'MONTHLY') endDate.setMonth(endDate.getMonth() + 1);
    else if (billingInterval === 'YEARLY') endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate;
  }

  private calculateNextBillingDate(billingInterval: string): Date {
    const nextBilling = new Date();
    if (billingInterval === 'MONTHLY') nextBilling.setMonth(nextBilling.getMonth() + 1);
    else if (billingInterval === 'YEARLY') nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    return nextBilling;
  }
}
