import { Injectable } from '@nestjs/common';
import type { User as PrismaUser } from '../../../generated/prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(entity: PrismaUser): User {
    return {
      id: entity.id,
      login: entity.login,
      password: entity.password,
      version: entity.version,
      createdAt: Number(entity.createdAt),
      updatedAt: Number(entity.updatedAt),
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.toDomain(u));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        login: user.login,
        password: user.password,
        version: user.version,
        createdAt: BigInt(user.createdAt),
        updatedAt: BigInt(user.updatedAt),
      },
    });

    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        login: user.login,
        password: user.password,
        version: user.version,
        updatedAt: BigInt(user.updatedAt),
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code?: string }).code === 'P2025'
      ) {
        return false;
      }
      throw err;
    }
  }
}
