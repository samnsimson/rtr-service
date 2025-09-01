import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkType, JobType, CompensationType, JobStatus } from '../../common/enums';

@InputType()
export class CreateJobInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  company: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @Field()
  @IsString()
  location: string;

  @Field(() => WorkType)
  @IsEnum(WorkType)
  workType: WorkType;

  @Field(() => JobType)
  @IsEnum(JobType)
  jobType: JobType;

  @Field(() => CompensationType)
  @IsEnum(CompensationType)
  compensation: CompensationType;

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

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @Field()
  @IsUUID()
  recruiterId: string;

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
