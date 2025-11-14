import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CompensationType, JobType, WorkType } from 'src/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@InputType()
export class JobListFiltersInput extends PaginationDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  query?: string;

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

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  starred?: boolean;
}
