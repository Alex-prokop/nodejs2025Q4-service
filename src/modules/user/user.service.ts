import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  private toResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;

    return {
      id,
      login,
      version,
      createdAt,
      updatedAt,
    };
  }

  findAll(): UserResponse[] {
    return this.db.users.map((u) => this.toResponse(u));
  }

  findOne(id: string): UserResponse {
    const user = this.db.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponse(user);
  }

  create(dto: CreateUserDto): UserResponse {
    const now = Date.now();

    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.db.users.push(user);

    return this.toResponse(user);
  }

  updatePassword(id: string, dto: UpdatePasswordDto): UserResponse {
    const user = this.db.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.toResponse(user);
  }

  remove(id: string): void {
    const index = this.db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.db.users.splice(index, 1);
  }
}
