import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrganizationInput, UpdateOrganizationInput, CreateUserInput } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../common/types';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Mutation(() => Organization, { name: 'createOrganization' })
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  async createOrganization(
    @Args('createOrganizationInput') createOrganizationInput: CreateOrganizationInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Organization> {
    return this.organizationsService.createOrganization(createOrganizationInput, user.id);
  }

  @Query(() => [Organization], { name: 'organizations' })
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Query(() => Organization, { name: 'organization' })
  async findOne(@Args('id') id: string, @CurrentUser() user: CurrentUserType): Promise<Organization> {
    // Check if user has access to this organization
    if (user.organizationId !== id && user.role !== UserRole.ADMIN) {
      throw new Error('Access denied to organization');
    }
    return this.organizationsService.findOne(id);
  }

  @Mutation(() => Organization, { name: 'updateOrganization' })
  async updateOrganization(
    @Args('id') id: string,
    @Args('updateOrganizationInput') updateOrganizationInput: UpdateOrganizationInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Organization> {
    return this.organizationsService.updateOrganization(id, updateOrganizationInput, user.id);
  }

  @Mutation(() => Boolean, { name: 'removeOrganization' })
  async removeOrganization(@Args('id') id: string, @CurrentUser() user: CurrentUserType): Promise<boolean> {
    return this.organizationsService.removeOrganization(id, user.id);
  }

  @Mutation(() => User, { name: 'createOrganizationUser' })
  async createOrganizationUser(
    @Args('organizationId') organizationId: string,
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<User> {
    return this.organizationsService.createUser(organizationId, createUserInput, user.id);
  }

  @Query(() => [User], { name: 'organizationUsers' })
  async getOrganizationUsers(@Args('organizationId') organizationId: string, @CurrentUser() user: CurrentUserType): Promise<User[]> {
    return this.organizationsService.getOrganizationUsers(organizationId, user.id);
  }

  @Mutation(() => User, { name: 'updateUserRole' })
  async updateUserRole(
    @Args('organizationId') organizationId: string,
    @Args('userId') userId: string,
    @Args('newRole') newRole: UserRole,
    @CurrentUser() user: CurrentUserType,
  ): Promise<User> {
    return this.organizationsService.updateUserRole(organizationId, userId, newRole, user.id);
  }

  @Mutation(() => Boolean, { name: 'removeUserFromOrganization' })
  async removeUserFromOrganization(
    @Args('organizationId') organizationId: string,
    @Args('userId') userId: string,
    @CurrentUser() user: CurrentUserType,
  ): Promise<boolean> {
    return this.organizationsService.removeUserFromOrganization(organizationId, userId, user.id);
  }

  @Query(() => String, { name: 'organizationStats' })
  async getOrganizationStats(@Args('organizationId') organizationId: string, @CurrentUser() user: CurrentUserType): Promise<any> {
    return this.organizationsService.getOrganizationStats(organizationId, user.id);
  }

  @ResolveField(() => [User], { name: 'users' })
  async getUsers(@Parent() organization: Organization): Promise<User[]> {
    return this.organizationsService.getOrganizationUsers(organization.id, organization.id);
  }
}
