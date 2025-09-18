import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CompiledRtrTemplateResponse {
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

  constructor(partial?: Partial<CompiledRtrTemplateResponse>) {
    Object.assign(this, partial);
  }
}
