import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RecruiterProfileResponse {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  linkedinUrl?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  organizationId?: string | null;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(props: Partial<RecruiterProfileResponse>) {
    Object.assign(this, props);
  }
}
