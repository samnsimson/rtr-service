import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRTRHistoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
