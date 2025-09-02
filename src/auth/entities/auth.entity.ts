import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums';

@ObjectType()
class Organization {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
class AuthUser {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Organization, { nullable: true })
  organization?: Organization;

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
