import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { CompanySize } from '../entities/recruiter-profile.entity';

@InputType()
export class CreateRecruiterProfileInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsString()
  companyName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  industry?: string;

  @Field(() => CompanySize, { nullable: true })
  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}
