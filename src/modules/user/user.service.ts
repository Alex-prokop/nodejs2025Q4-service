import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserResponse } from './entities/user.entity';
import { UserMapper } from './user.mapper';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();

    return users.map((u) => UserMapper.toResponse(u));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toResponse(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const now = Date.now();

    const hashedPassword = await hashPassword(dto.password);

    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.userRepository.create(user);

    return UserMapper.toResponse(created);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValid = await verifyPassword(dto.oldPassword, user.password);

    if (!isValid) {
      throw new ForbiddenException('Old password is wrong');
    }

    const newHashedPassword = await hashPassword(dto.newPassword);

    user.password = newHashedPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const updated = await this.userRepository.update(user);

    return UserMapper.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
