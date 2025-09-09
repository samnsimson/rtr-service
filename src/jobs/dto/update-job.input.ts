import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateJobInput } from './create-job.input';

@InputType()
export class UpdateJobInput extends PartialType(CreateJobInput) {
  @Field()
  id: string;
}
