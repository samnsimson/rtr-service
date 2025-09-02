import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { CreatePaymentInput, ProcessPaymentInput } from './dto';
import { CurrentUser } from '../common/types';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
  ) {}

  async createPayment(createPaymentInput: CreatePaymentInput, user: CurrentUser): Promise<Payment> {
    const { subscriptionId, organizationId, amount, currency, paymentMethod, description } = createPaymentInput;

    // Verify subscription exists if provided
    if (subscriptionId) {
      const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
      if (!subscription) throw new NotFoundException('Subscription not found');
    }

    // Verify organization exists if provided
    if (organizationId) {
      const organization = await this.orgRepo.findOne({ where: { id: organizationId } });
      if (!organization) throw new NotFoundException('Organization not found');
    }

    const payment = this.paymentRepo.create({
      userId: user.id,
      organizationId: organizationId || user.organizationId,
      subscriptionId,
      status: PaymentStatus.PENDING,
      paymentMethod: paymentMethod || PaymentMethod.CARD,
      amount,
      currency,
      description,
    });

    return this.paymentRepo.save(payment);
  }

  async findAll(user?: CurrentUser): Promise<Payment[]> {
    const where: any = {};
    if (user) where.userId = user.id;
    return this.paymentRepo.find({ where, relations: ['user', 'organization', 'subscription'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user?: CurrentUser): Promise<Payment> {
    const where: any = { id };
    if (user) where.userId = user.id;
    const payment = await this.paymentRepo.findOne({ where, relations: ['user', 'organization', 'subscription'] });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async processPayment(processPaymentInput: ProcessPaymentInput, user: CurrentUser): Promise<Payment> {
    const { subscriptionId } = processPaymentInput;
    // Get subscription
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId }, relations: ['plan'] });
    if (!subscription) throw new NotFoundException('Subscription not found');

    // Create payment record
    const payment = this.paymentRepo.create({
      userId: user.id,
      organizationId: user.organizationId,
      subscriptionId: subscription.id,
      status: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CARD,
      amount: subscription.amount,
      currency: subscription.currency,
      description: `Payment for ${subscription.plan.name}`,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    try {
      // Here you would integrate with Stripe
      // For now, we'll simulate a successful payment
      await this.simulateStripePayment(savedPayment);

      return savedPayment;
    } catch (error) {
      // Update payment status to failed
      savedPayment.status = PaymentStatus.FAILED;
      savedPayment.failureReason = error.message;
      await this.paymentRepo.save(savedPayment);
      throw new BadRequestException(`Payment failed: ${error.message}`);
    }
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus, stripeData?: any): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = status;

    if (status === PaymentStatus.COMPLETED) {
      payment.paidAt = new Date();
      if (stripeData?.paymentIntentId) payment.stripePaymentIntentId = stripeData.paymentIntentId;
      if (stripeData?.chargeId) payment.stripeChargeId = stripeData.chargeId;
      if (stripeData?.receiptUrl) payment.receiptUrl = stripeData.receiptUrl;
    } else if (status === PaymentStatus.FAILED) {
      payment.failureReason = stripeData?.failureReason || 'Payment failed';
    }

    return this.paymentRepo.save(payment);
  }

  async getOrganizationPayments(organizationId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { organizationId }, relations: ['user', 'subscription'], order: { createdAt: 'DESC' } });
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { userId }, relations: ['organization', 'subscription'], order: { createdAt: 'DESC' } });
  }

  private async simulateStripePayment(payment: Payment): Promise<void> {
    // Simulate Stripe API call
    // In a real implementation, you would:
    // 1. Create or retrieve Stripe customer
    // 2. Create payment intent
    // 3. Confirm payment intent
    // 4. Handle webhooks for payment status updates

    // For simulation, we'll just mark as completed
    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    payment.stripePaymentIntentId = `pi_simulated_${Date.now()}`;
    payment.stripeChargeId = `ch_simulated_${Date.now()}`;
    payment.receiptUrl = `https://pay.stripe.com/receipts/simulated_${Date.now()}`;

    await this.paymentRepo.save(payment);
  }
}
