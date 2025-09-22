import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RTRStatus } from 'src/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@InputType()
export class RtrFiltersInput extends PaginationDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  candidateName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  company?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @Field(() => RTRStatus, { nullable: true })
  @IsEnum(RTRStatus)
  @IsOptional()
  status?: RTRStatus;
}
