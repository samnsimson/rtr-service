import { Field, Int } from '@nestjs/graphql';
import { UserResponse } from './user-response.dto';
import { PaginatedResponse } from 'src/common/dto/paginated-response.dto';

export class PaginatedUserResponse implements PaginatedResponse<UserResponse> {
  @Field(() => [UserResponse])
  data: UserResponse[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPages: number;

  constructor(partial?: Partial<PaginatedUserResponse>) {
    Object.assign(this, partial);
    this.page = partial?.page || 1;
    this.limit = partial?.limit || 10;
    this.totalPages = Math.ceil(this.total / this.limit);
  }
}
