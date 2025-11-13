import { CreateCandidateListInput } from './create-candidate-list.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCandidateListInput extends PartialType(CreateCandidateListInput) {
  @Field(() => Int)
  id: number;
}
