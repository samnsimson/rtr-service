import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRecruiterProfileInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
