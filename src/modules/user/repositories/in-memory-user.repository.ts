import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../../../common/database/database.service';
import { User } from '../entities/user.entity';

@Injectable()
export class InMemoryUserRepository extends UserRepository {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async findAll(): Promise<User[]> {
    return this.db.users;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.db.users.find((u) => u.id === id);
    return user ?? null;
  }

  async create(user: User): Promise<User> {
    this.db.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.db.users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      this.db.users.push(user);
      return user;
    }

    this.db.users[index] = user;
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return false;
    }

    this.db.users.splice(index, 1);
    return true;
  }
}
