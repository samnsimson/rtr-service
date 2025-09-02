import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsBoolean } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/payment.entity';

@InputType()
export class CreatePaymentInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  subscriptionId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  organizationId?: string;

  @Field(() => Number)
  @IsNumber()
  amount: number;

  @Field(() => String)
  @IsString()
  currency: string;

  @Field(() => PaymentMethod, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  savePaymentMethod?: boolean;
}
