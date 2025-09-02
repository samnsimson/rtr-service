import { InputType, Field } from '@nestjs/graphql';
import { CompanySize } from '../../common/enums';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => CompanySize, { nullable: true })
  companySize?: CompanySize;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  linkedinUrl?: string;

  @Field(() => String, { nullable: true })
  logo?: string;
}
