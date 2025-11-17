import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, Min, IsBoolean, IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkType, JobType, CompensationType, JobStatus, ExperiencePeriod } from '../../common/enums';

@InputType()
export class SkillRequirementInput {
  @Field(() => String)
  @IsString()
  skill: string;

  @Field(() => Number)
  @IsNumber()
  @Min(0)
  experience: number;

  @Field(() => ExperiencePeriod, { defaultValue: ExperiencePeriod.YEARS })
  @IsEnum(ExperiencePeriod)
  experiencePeriod: ExperiencePeriod;

  constructor(partial?: Partial<SkillRequirementInput>) {
    Object.assign(this, partial);
  }
}

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

  @Field(() => [SkillRequirementInput])
  @IsArray()
  @IsNotEmpty({ each: true })
  skillsRequired: SkillRequirementInput[];

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
