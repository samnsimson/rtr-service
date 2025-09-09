import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { LoginInput, RegisterInput } from './dto';
import { UserRole } from '../common/enums';
import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
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
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        organization: organization ? { id: organization.id, name: organization.name } : null,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    };
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
        const organizationData = { name: `${user.name}'s Organization` };
        const organization = await this.organizationsService.createOrganization(organizationData, user.id);
        await this.usersService.update(user.id, { organizationId: organization.id, role: UserRole.ORGANIZATION_OWNER });
        return this.authResponse(user, organization);
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      const newPayload = { email: user.email, sub: user.id, role: user.role, organizationId: user.organizationId };
      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          organization: user.organization ? { id: user.organization.id, name: user.organization.name } : null,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
        },
      };
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
