import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GraphQLContextFactory {
  constructor(
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
  ) {}

  createContext(req: Request & { user: any }): { req: Request & { user: any }; user: any } {
    const token = this.extractTokenFromHeader(req);
    let user: any = null;
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        user = { id: payload.sub, email: payload.email, role: payload.role };
      } catch (error) {
        console.log('🚀 ~ GraphQLContextFactory ~ createContext ~ error:', error);
      }
    }
    return { req, user };
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
