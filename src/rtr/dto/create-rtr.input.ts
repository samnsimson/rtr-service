import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRTRInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
