import { Field, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class PaginatedResponse<T> {
  @Field(() => [Object], { description: 'Array of items' })
  abstract data: T[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
