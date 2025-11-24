import { InputType, Field } from '@nestjs/graphql';
import { CompanySize } from 'src/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateOrganizationInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  website?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  industry?: string;

  @Field(() => CompanySize, { nullable: true })
  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  zipcode?: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  country?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  latitude?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  longitude?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  stripeCustomerId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logo?: string;
}
