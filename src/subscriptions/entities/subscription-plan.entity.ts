import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { BillingInterval, PlanType } from 'src/common';

@ObjectType()
export class PlanFeature {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isEnabled: boolean;

  constructor(data: Partial<PlanFeature>) {
    Object.assign(this, data);
  }
}

@ObjectType()
@Entity('subscription_plans')
export class SubscriptionPlan {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => PlanType)
  @Column({ type: 'enum', enum: PlanType })
  planType: PlanType;

  @Field(() => BillingInterval)
  @Column({ type: 'enum', enum: BillingInterval })
  billingInterval: BillingInterval;

  @Field(() => Number)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: 'int' })
  maxUsers: number;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: 'int', default: 0 })
  maxJobs: number;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: 'int', default: 0 })
  maxRTRs: number;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: 'int', default: 0 })
  maxEmails: number;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: 'int', default: 0 })
  maxSMS: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripePriceId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripePaymentLink?: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [PlanFeature], { nullable: true, defaultValue: [] })
  @Column({ type: 'jsonb', nullable: true, default: [] })
  features: PlanFeature[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  constructor(data: Partial<SubscriptionPlan>) {
    Object.assign(this, data);
  }
}
