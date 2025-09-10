import { IsString, IsOptional, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRecruiterProfileInput {
  @Field()
  @IsUUID()
  userId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;
}
