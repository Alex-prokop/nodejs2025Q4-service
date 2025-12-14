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

  private isPublicPath(path: string): boolean {
    if (!path) return false;

    return (
      path === '/' ||
      path.startsWith('/doc') ||
      path === '/auth/signup' ||
      path === '/auth/login' ||
      path === '/auth/refresh'
    );
  }

  private shouldCheckAuth(): boolean {
    return process.env.TEST_MODE === 'auth';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const path = req.path;

    if (!this.shouldCheckAuth()) {
      return true;
    }

    if (this.isPublicPath(path)) {
      return true;
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      req.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
