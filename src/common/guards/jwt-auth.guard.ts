import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const payload = this.jwtService.verify(token);
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch (error) {
      console.log('🚀 ~ JwtAuthGuard ~ canActivate ~ error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
