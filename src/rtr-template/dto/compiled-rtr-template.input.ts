import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class RtrTemplateCandidateInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;
}

@InputType()
export class CompiledRtrTemplateInput {
  @Field(() => String)
  @IsUUID()
  templateId: string;

  @Field(() => String)
  @IsUUID()
  jobId: string;

  @Field(() => RtrTemplateCandidateInput, { nullable: true })
  @IsOptional()
  candidate?: RtrTemplateCandidateInput;
}
