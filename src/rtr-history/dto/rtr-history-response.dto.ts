import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RTRHistoryResponse {
  @Field()
  id: string;

  @Field()
  rtrId: string;

  @Field()
  userId: string;

  @Field()
  action: string;

  @Field({ nullable: true })
  details?: string;

  @Field()
  createdAt: Date;
}
