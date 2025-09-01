import { ObjectType, Field } from '@nestjs/graphql';
import { CompanySize } from '../../common/enums';

@ObjectType()
export class RecruiterProfileResponse {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  companyName: string;

  @Field({ nullable: true })
  companyWebsite?: string;

  @Field({ nullable: true })
  industry?: string;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  linkedinUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
