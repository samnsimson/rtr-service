import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { SubscriptionStatus } from '../entities/subscription.entity';

@InputType()
export class UpdateSubscriptionInput {
  @Field(() => SubscriptionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  cancelledAt?: string;
}
