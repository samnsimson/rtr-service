import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCandidateProfileInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
