import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { RTRStatus } from '../entities/rtr.entity';

@InputType()
export class CreateRTRInput {
  @Field()
  @IsUUID()
  candidateId: string;

  @Field()
  @IsUUID()
  recruiterId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  jobId?: string;

  @Field(() => RTRStatus, { nullable: true })
  @IsOptional()
  @IsEnum(RTRStatus)
  status?: RTRStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
