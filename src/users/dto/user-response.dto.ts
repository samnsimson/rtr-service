import { ObjectType, Field } from '@nestjs/graphql';
import { UserRole } from '../entities/user.entity';

@ObjectType()
export class UserResponseDto {
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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
