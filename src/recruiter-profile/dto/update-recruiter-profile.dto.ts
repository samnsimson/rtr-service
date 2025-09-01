import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateRecruiterProfileInput } from './create-recruiter-profile.dto';

@InputType()
export class UpdateRecruiterProfileInput extends PartialType(CreateRecruiterProfileInput) {
  @Field()
  id: string;
}
