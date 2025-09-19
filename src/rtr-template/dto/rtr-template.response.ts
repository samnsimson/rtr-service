import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RtrTemplateFormattedResponse {
  @Field(() => String)
  text: string;

  @Field(() => String)
  html: string;

  constructor(partial?: Partial<RtrTemplateFormattedResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class RtrTemplateResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  html: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  constructor(partial?: Partial<RtrTemplateResponse>) {
    Object.assign(this, partial);
  }
}
