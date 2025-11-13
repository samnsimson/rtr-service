import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEmployerListInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
