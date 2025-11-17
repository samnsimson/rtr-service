import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompanyResponse {
  @Field(() => String)
  name: string;

  constructor(partial?: Partial<CompanyResponse>) {
    Object.assign(this, partial);
  }
}
