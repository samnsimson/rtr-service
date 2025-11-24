import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { StripePaymentInterval } from 'src/common';
import Stripe from 'stripe';

@InputType()
export class CreateStripeProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;
}

@InputType()
export class CreateStripePriceInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsEnum(StripePaymentInterval)
  @Field(() => StripePaymentInterval, { defaultValue: StripePaymentInterval.MONTH })
  interval: StripePaymentInterval;
}

@ObjectType()
export class StripeProductResponse {
  @Field(() => String)
  id: string;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => Number)
  created: number;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => [String])
  images: string[];

  @Field(() => Boolean)
  livemode: boolean;

  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true })
  shippable: boolean | null;

  @Field(() => String, { nullable: true })
  tax_code: string | Stripe.TaxCode | null;

  @Field(() => String, { nullable: true })
  url: string | null;

  constructor(partial?: Partial<StripeProductResponse>) {
    Object.assign(this, partial);
  }
}

@InputType()
export class CreateStripePaymentLinkInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
