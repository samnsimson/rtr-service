import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums';

@ObjectType()
export class Org {
  @Field()
  id: string;

  @Field()
  name: string;

  constructor(partial: Partial<Org>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Org, { nullable: true })
  organization?: Org;

  @Field()
  isActive: boolean;

  @Field()
  isEmailVerified: boolean;

  constructor(partial: Partial<AuthUser>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  tokenType: string;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => AuthUser)
  user: AuthUser;

  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial);
  }
}
