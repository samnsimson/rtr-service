import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RtrHistory {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
