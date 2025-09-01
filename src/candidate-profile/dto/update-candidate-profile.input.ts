import { CreateCandidateProfileInput } from './create-candidate-profile.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCandidateProfileInput extends PartialType(CreateCandidateProfileInput) {
  @Field(() => Int)
  id: number;
}
