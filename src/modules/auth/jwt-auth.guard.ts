import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpCtx = context.switchToHttp();
    const req = httpCtx.getRequest<Request>();

    const isAuthMode = process.env.TEST_MODE === 'auth';

    if (!isAuthMode) {
      return true;
    }

    const path = req.path || req.url;

    if (path === '/' || path.startsWith('/doc') || path.startsWith('/auth/')) {
      return true;
    }

    const authHeader =
      (req.headers['authorization'] as string | undefined) ||
      (req.headers['Authorization'] as string | undefined);

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      (req as any).user = payload;

      return true;
    } catch (_err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
