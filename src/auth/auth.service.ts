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
    const payload = { email: user.email, sub: user.id, role: user.role, organizationId: user.organizationId };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        organization: user.organization ? { id: user.organization.id, name: user.organization.name } : null,
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
    const organizationData = { name: `${user.name}'s Organization` };
    const organization = await this.organizationsService.createOrganization(organizationData, user.id);
    await this.usersService.update(user.id, { organizationId: organization.id, role: UserRole.ORGANIZATION_OWNER });

    // Get updated user with organization data
    const updatedUser = await this.usersService.findOne(user.id);
    const payload = { email: updatedUser.email, sub: updatedUser.id, role: updatedUser.role, organizationId: updatedUser.organizationId };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
        organization: updatedUser.organization ? { id: updatedUser.organization.id, name: updatedUser.organization.name } : null,
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
