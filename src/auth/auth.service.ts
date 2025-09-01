import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginInput, RegisterInput } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone },
    };
  }

  async register(registerInput: RegisterInput) {
    // Check if user already exists
    try {
      const existingUser = await this.usersService.findByEmail(registerInput.email);
      if (existingUser) throw new ConflictException('User with this email already exists');
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
    }

    // Create new user
    const user = await this.usersService.create(registerInput);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone },
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
