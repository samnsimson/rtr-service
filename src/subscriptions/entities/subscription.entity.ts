import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { BillingInterval, PlanType, SubscriptionStatus } from 'src/common';

@ObjectType()
@Entity('subscriptions')
export class Subscription {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId?: string;

  @Field(() => String)
  @Column()
  planId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeSubscriptionId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Field(() => SubscriptionStatus)
  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Field(() => Date)
  @Column()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  endDate?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  nextBillingDate?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  cancelledAt?: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  cancellationReason?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  autoRenew: boolean;

  @Field(() => Number)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => PlanType)
  @Column({ type: 'enum', enum: PlanType })
  planType: PlanType;

  @Field(() => BillingInterval)
  @Column({ type: 'enum', enum: BillingInterval })
  billingInterval: BillingInterval;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.subscriptions, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @Field(() => SubscriptionPlan)
  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
