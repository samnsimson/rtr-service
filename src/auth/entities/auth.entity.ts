import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums';

@ObjectType()
class OrganizationInfo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  logo?: string;
}

@ObjectType()
class AuthUser {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  organizationId?: string;

  @Field(() => OrganizationInfo, { nullable: true })
  organization?: OrganizationInfo;

  @Field()
  isActive: boolean;

  @Field()
  isEmailVerified: boolean;
}

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => AuthUser)
  user: AuthUser;
}
