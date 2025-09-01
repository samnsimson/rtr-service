import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { RemotePreference } from '../entities/candidate-profile.entity';

@InputType()
export class CreateCandidateProfileInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experience?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  willingToRelocate?: boolean;

  @Field(() => RemotePreference, { nullable: true })
  @IsOptional()
  @IsEnum(RemotePreference)
  remotePreference?: RemotePreference;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedSalary?: number;
}
