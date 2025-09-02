import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { LoginInput, RegisterInput } from './dto';
import { UserRole } from '../common/enums';

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

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        organizationId: user.organizationId,
        organization: user.organization
          ? {
              id: user.organization.id,
              name: user.organization.name,
              website: user.organization.website,
              industry: user.organization.industry,
              location: user.organization.location,
              logo: user.organization.logo,
            }
          : null,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async register(registerInput: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(registerInput.email);
    if (existingUser) throw new ConflictException('User with this email already exists');

    // Create user first
    const user = await this.usersService.create(registerInput);

    // If organization data is provided and user role is RECRUITER, create organization
    if (registerInput.organization && (registerInput.role === UserRole.RECRUITER || !registerInput.role)) {
      const organization = await this.organizationsService.createOrganization(registerInput.organization, user.id);
      // Update user with organization info
      user.organizationId = organization.id;
      user.role = UserRole.ORGANIZATION_OWNER;
      await this.usersService.update(user.id, { organizationId: organization.id, role: UserRole.ORGANIZATION_OWNER });
    }

    // Get updated user with organization data
    const updatedUser = await this.usersService.findOne(user.id);

    const payload = {
      email: updatedUser.email,
      sub: updatedUser.id,
      role: updatedUser.role,
      organizationId: updatedUser.organizationId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        organizationId: updatedUser.organizationId,
        organization: updatedUser.organization
          ? {
              id: updatedUser.organization.id,
              name: updatedUser.organization.name,
              website: updatedUser.organization.website,
              industry: updatedUser.organization.industry,
              location: updatedUser.organization.location,
              logo: updatedUser.organization.logo,
            }
          : null,
        isActive: updatedUser.isActive,
        isEmailVerified: updatedUser.isEmailVerified,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      const newPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        organizationId: user.organizationId,
      };
      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          organizationId: user.organizationId,
          organization: user.organization
            ? {
                id: user.organization.id,
                name: user.organization.name,
                website: user.organization.website,
                industry: user.organization.industry,
                location: user.organization.location,
                logo: user.organization.logo,
              }
            : null,
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
