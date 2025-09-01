import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Rtr {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
