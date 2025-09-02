import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums';

@InputType()
export class CreateOrganizationUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}
