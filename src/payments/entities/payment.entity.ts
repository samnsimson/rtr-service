import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET = 'WALLET',
  OTHER = 'OTHER',
}

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

@ObjectType()
@Entity('payments')
export class Payment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizationId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  subscriptionId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripePaymentIntentId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeChargeId?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  stripeInvoiceId?: string;

  @Field(() => PaymentStatus)
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Field(() => PaymentMethod)
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CARD })
  paymentMethod: PaymentMethod;

  @Field(() => Number)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  failureReason?: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  paidAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  refundedAt?: Date;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundedAmount?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  receiptUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  invoiceUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'json', nullable: true })
  metadata?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Organization, { nullable: true })
  @ManyToOne(() => Organization, (organization) => organization.payments, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @Field(() => Subscription, { nullable: true })
  @ManyToOne(() => Subscription, (subscription) => subscription.payments, { nullable: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription?: Subscription;
}
