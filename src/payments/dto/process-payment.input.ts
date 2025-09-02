import { IsString, IsOptional, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProcessPaymentInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  subscriptionId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerId?: string;
}
