import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CandidateProfile {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
