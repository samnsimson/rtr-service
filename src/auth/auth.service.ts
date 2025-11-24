import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { LoginInput, RegisterInput } from './dto';
import { UserRole } from '../common/enums';
import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { RecruiterProfileService } from 'src/recruiter-profile/recruiter-profile.service';
import { Auth, AuthUser, Org } from './entities/auth.entity';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { CreateOrganizationInput } from 'src/organizations/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private recruiterProfileService: RecruiterProfileService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(email, password);
      return user;
    } catch (error) {
      console.log('🚀 ~ AuthService ~ validateUser ~ error:', error);
      return null;
    }
  }

  authResponse(user: User, organization: Organization) {
    const payload = { email: user.email, sub: user.id, role: user.role, organizationId: organization.id };
    const org = new Org({ id: organization.id, name: organization.name });
    const authUser = new AuthUser({ ...user, organization: org });
    return new Auth({
      tokenType: 'Bearer',
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresAt: add(new Date(), { hours: 1 }),
      user: authUser,
    });
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authResponse(user, user.organization);
  }

  async register(registerInput: RegisterInput) {
    try {
      const existingUser = await this.usersService.findByEmail(registerInput.email);
      if (existingUser) throw new ConflictException('User with this email already exists');
    } catch (error) {
      if (error instanceof NotFoundException) {
        const user = await this.usersService.create(registerInput);
        const organizationData: CreateOrganizationInput = { name: `${user.name}'s Organization` };
        const organization = await this.organizationsService.createOrganization(organizationData, user.id);
        const updatedUser = await this.usersService.update(user.id, { organizationId: organization.id, role: UserRole.ORGANIZATION_OWNER });
        await this.recruiterProfileService.create({ userId: user.id });
        return this.authResponse(updatedUser, organization);
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      return this.authResponse(user, user.organization);
    } catch (error) {
      console.log('🚀 ~ AuthService ~ refreshToken ~ error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      console.log('🚀 ~ AuthService ~ verifyToken ~ error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
