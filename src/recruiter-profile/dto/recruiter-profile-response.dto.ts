import { ObjectType, Field } from '@nestjs/graphql';
import { CompanySize } from '../entities/recruiter-profile.entity';

@ObjectType()
export class RecruiterProfileResponseDto {
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

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
