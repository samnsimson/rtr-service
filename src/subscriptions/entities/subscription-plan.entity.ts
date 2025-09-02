import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';

export enum PlanType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

registerEnumType(PlanType, { name: 'PlanType' });
registerEnumType(BillingInterval, { name: 'BillingInterval' });

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

  @Field(() => Number)
  @Column({ type: 'int' })
  maxUsers: number;

  @Field(() => Number)
  @Column({ type: 'int' })
  maxJobs: number;

  @Field(() => Number)
  @Column({ type: 'int' })
  maxRTRs: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripePriceId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeProductId?: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [String])
  @Column({ type: 'json', default: [] })
  features: string[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Subscription], { nullable: true })
  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
