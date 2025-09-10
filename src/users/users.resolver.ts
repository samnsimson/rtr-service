import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput, UserResponse } from './dto';
import { GraphQLValidate } from '../common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/types';
import { PaginatedUserResponse } from './dto/paginated-user-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Resolver(() => UserResponse)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserResponse)
  @GraphQLValidate()
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserResponse> {
    const user = await this.usersService.create(createUserInput);
    return new UserResponse(user);
  }

  @Query(() => [UserResponse], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ADMIN, UserRole.CANDIDATE)
  async findAll(@Args('pagination', { type: () => PaginationDto, nullable: true }) pagination: PaginationDto): Promise<PaginatedUserResponse> {
    const take = pagination.limit;
    const skip = (pagination.page - 1) * pagination.limit;
    const users = await this.usersService.findAll({ relations: ['organization', 'recruiterProfile'], skip, take });
    return new PaginatedUserResponse({ data: users.map((user) => new UserResponse(user)), ...pagination });
  }

  @Query(() => UserResponse, { name: 'user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  async findOne(@Args('id') id: string): Promise<UserResponse> {
    const user = await this.usersService.findOne(id);
    return new UserResponse(user);
  }

  @Query(() => UserResponse, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@AuthUser() user: CurrentUser): Promise<UserResponse> {
    const currentUser = await this.usersService.findOne(user.id);
    return new UserResponse(currentUser);
  }

  @Mutation(() => UserResponse)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  @GraphQLValidate()
  async updateUser(@Args('id') id: string, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserResponse> {
    const user = await this.usersService.update(id, updateUserInput);
    return new UserResponse(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ADMIN)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}
