import { CompanySize } from 'src/common';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OrganizationResponseDto {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field(() => String, { nullable: true })
  stripeCustomerId?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  zipcode?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  latitude?: string;

  @Field(() => String, { nullable: true })
  longitude?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  constructor(partial?: Partial<OrganizationResponseDto>) {
    Object.assign(this, partial);
  }
}
