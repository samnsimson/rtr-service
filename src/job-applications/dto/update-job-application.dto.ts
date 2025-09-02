import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ApplicationStatus } from '../../common/enums';

@InputType()
export class UpdateJobApplicationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
