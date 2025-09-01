import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, UserResponseDto } from './dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserResponseDto)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserInput);
    return new UserResponseDto(user);
  }

  @Query(() => [UserResponseDto], { name: 'users' })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  @Query(() => UserResponseDto, { name: 'user' })
  async findOne(@Args('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return new UserResponseDto(user);
  }

  @Mutation(() => UserResponseDto)
  async updateUser(@Args('id') id: string, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserInput);
    return new UserResponseDto(user);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}
