import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateJobApplicationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
