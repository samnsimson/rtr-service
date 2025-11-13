import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EmployerList {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
