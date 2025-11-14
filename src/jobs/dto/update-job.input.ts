import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsArray, IsEnum, IsOptional, IsNumber, Min, IsDateString, IsBoolean, IsNotEmpty } from 'class-validator';
import { WorkType, JobType, CompensationType, JobStatus } from 'src/common';

@InputType()
export class UpdateJobInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  company?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field(() => WorkType, { nullable: true })
  @IsEnum(WorkType)
  @IsOptional()
  workType?: WorkType;

  @Field(() => JobType, { nullable: true })
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @Field(() => CompensationType, { nullable: true })
  @IsEnum(CompensationType)
  @IsOptional()
  compensation?: CompensationType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  starred?: boolean;
}
