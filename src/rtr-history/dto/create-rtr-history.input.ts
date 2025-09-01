import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRtrHistoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
