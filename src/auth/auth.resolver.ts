import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entities';
import { LoginInput, RegisterInput, RefreshTokenInput } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { GraphQLValidate } from '../common/decorators';
import { CurrentUser } from '../common/types';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, { name: 'login' })
  @GraphQLValidate()
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Auth, { name: 'register' })
  @GraphQLValidate()
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => Auth, { name: 'refreshToken' })
  @GraphQLValidate()
  async refreshToken(@Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput) {
    return this.authService.refreshToken(refreshTokenInput.refreshToken);
  }

  @Query(() => String, { name: 'verifyToken' })
  @UseGuards(JwtAuthGuard)
  verifyToken(@AuthUser() user: CurrentUser) {
    return `Token is valid for user: ${user.email}`;
  }
}
