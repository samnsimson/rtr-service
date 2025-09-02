import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput, ProcessPaymentInput } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../common/types';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';

@Resolver(() => Payment)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => Payment, { name: 'createPayment' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput, @AuthUser() user: CurrentUserType): Promise<Payment> {
    return this.paymentsService.createPayment(createPaymentInput, user);
  }

  @Mutation(() => Payment, { name: 'processPayment' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async processPayment(@Args('processPaymentInput') processPaymentInput: ProcessPaymentInput, @AuthUser() user: CurrentUserType): Promise<Payment> {
    return this.paymentsService.processPayment(processPaymentInput, user);
  }

  @Query(() => [Payment], { name: 'payments' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async findAll(@AuthUser() user: CurrentUserType): Promise<Payment[]> {
    return this.paymentsService.findAll(user);
  }

  @Query(() => Payment, { name: 'payment' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUserType): Promise<Payment> {
    return this.paymentsService.findOne(id, user);
  }

  @Query(() => [Payment], { name: 'organizationPayments' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async getOrganizationPayments(@Args('organizationId', { type: () => String }) organizationId: string): Promise<Payment[]> {
    return this.paymentsService.getOrganizationPayments(organizationId);
  }

  @Query(() => [Payment], { name: 'userPayments' })
  @Roles(UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.ADMIN)
  async getUserPayments(@Args('userId', { type: () => String }) userId: string): Promise<Payment[]> {
    return this.paymentsService.getUserPayments(userId);
  }

  @ResolveField(() => User)
  user(@Parent() payment: Payment): User {
    return payment.user;
  }

  @ResolveField(() => Organization, { nullable: true })
  organization(@Parent() payment: Payment): Organization | null {
    return payment.organization || null;
  }

  @ResolveField(() => Subscription, { nullable: true })
  subscription(@Parent() payment: Payment): Subscription | null {
    return payment.subscription || null;
  }
}
