import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import { CreateCandidateProfileInput } from './create-candidate-profile.dto';

@InputType()
export class UpdateCandidateProfileInput extends PartialType(CreateCandidateProfileInput) {
  @Field()
  id: string;
}
