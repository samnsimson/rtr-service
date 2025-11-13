import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCandidateListInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
