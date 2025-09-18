import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsBoolean, IsNumber, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { CompensationType, RTRStatus } from '../../common/enums';

@InputType()
export class CreateRtrInput {
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsUUID()
  jobId: string;

  @Field()
  @IsUUID()
  rtrTemplateId: string;

  @Field(() => RTRStatus, { nullable: true, defaultValue: RTRStatus.PENDING })
  @IsOptional()
  @IsEnum(RTRStatus)
  status?: RTRStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  compensation?: number;

  @Field(() => CompensationType)
  @IsEnum(CompensationType)
  compensationType?: CompensationType;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  resumeRequired?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  photoIdRequired?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  employerDetailsRequired?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  referencesRequired?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  skillsRequired?: boolean;
}
