import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { PlanType, BillingInterval } from 'src/common';

@InputType()
export class CreateSubscriptionInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  planId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId?: string;

  @Field(() => PlanType)
  @IsEnum(PlanType)
  planType: PlanType;

  @Field(() => BillingInterval)
  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  autoRenew?: boolean;
}
