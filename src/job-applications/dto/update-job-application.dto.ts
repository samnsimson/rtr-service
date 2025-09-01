import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateJobApplicationInput } from './create-job-application.dto';

@InputType()
export class UpdateJobApplicationInput extends PartialType(CreateJobApplicationInput) {
  @Field()
  id: string;
}
