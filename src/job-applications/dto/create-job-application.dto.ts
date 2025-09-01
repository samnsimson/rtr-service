import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ApplicationStatus } from '../../common/enums';

@InputType()
export class CreateJobApplicationInput {
  @Field()
  @IsUUID()
  jobId: string;

  @Field()
  @IsUUID()
  candidateId: string;

  @Field(() => ApplicationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverLetter?: string;
}
