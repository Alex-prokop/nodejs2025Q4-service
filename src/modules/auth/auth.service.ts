import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getAccessSecret(): string {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not set');
    }
    return secret;
  }

  private getRefreshSecret(): string {
    const secret = process.env.JWT_SECRET_REFRESH_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_REFRESH_KEY is not set');
    }
    return secret;
  }

  private getAccessExpire(): string | number {
    return process.env.TOKEN_EXPIRE_TIME || '1h';
  }

  private getRefreshExpire(): string | number {
    return process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync<JwtPayload>(payload, {
        secret: this.getAccessSecret(),
        expiresIn: this.getAccessExpire() as any,
      }),
      this.jwtService.signAsync<JwtPayload>(payload, {
        secret: this.getRefreshSecret(),
        expiresIn: this.getRefreshExpire() as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // --------- signup ---------

  async signup(login: string, password: string): Promise<{ message: string }> {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('login and password must be strings');
    }

    const existing = await this.prisma.user.findUnique({
      where: { login },
    });

    if (existing) {
      throw new ConflictException('Login already exists');
    }

    const now = Date.now();
    const id = randomUUID();
    const passwordHash = await hashPassword(password);

    await this.prisma.user.create({
      data: {
        id,
        login,
        password: passwordHash,
        version: 1,
        createdAt: BigInt(now),
        updatedAt: BigInt(now),
      },
    });

    return { message: 'User created' };
  }

  // --------- login ---------

  async login(login: string, password: string): Promise<Tokens> {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('login and password must be strings');
    }

    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Invalid login or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      login: user.login,
    };

    return this.generateTokens(payload);
  }

  // --------- refresh ---------

  async refreshToken(refreshToken: string): Promise<Tokens> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new BadRequestException('refreshToken must be provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        { secret: this.getRefreshSecret() },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        userId: user.id,
        login: user.login,
      };

      return this.generateTokens(newPayload);
    } catch (_err) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
