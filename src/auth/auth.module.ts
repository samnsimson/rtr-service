import { Module, forwardRef } from '@nestjs/common';
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
import { RecruiterProfileModule } from 'src/recruiter-profile/recruiter-profile.module';

@Module({
  imports: [PassportModule, forwardRef(() => UsersModule), forwardRef(() => OrganizationsModule), forwardRef(() => RecruiterProfileModule)],
  providers: [AuthResolver, AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard, LocalAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, LocalAuthGuard, RolesGuard],
})
export class AuthModule {}
