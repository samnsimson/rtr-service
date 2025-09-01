import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput, UserResponse } from './dto';

@Resolver(() => UserResponse)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserResponse> {
    const user = await this.usersService.create(createUserInput);
    return new UserResponse(user);
  }

  @Query(() => [UserResponse], { name: 'users' })
  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserResponse(user));
  }

  @Query(() => UserResponse, { name: 'user' })
  async findOne(@Args('id') id: string): Promise<UserResponse> {
    const user = await this.usersService.findOne(id);
    return new UserResponse(user);
  }

  @Mutation(() => UserResponse)
  async updateUser(@Args('id') id: string, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserResponse> {
    const user = await this.usersService.update(id, updateUserInput);
    return new UserResponse(user);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}
