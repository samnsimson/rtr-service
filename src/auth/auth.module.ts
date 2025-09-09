import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PassportModule, forwardRef(() => UsersModule), forwardRef(() => OrganizationsModule)],
  providers: [AuthResolver, AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard, LocalAuthGuard, RolesGuard, JwtService],
  exports: [AuthService, JwtAuthGuard, LocalAuthGuard, RolesGuard],
})
export class AuthModule {}
