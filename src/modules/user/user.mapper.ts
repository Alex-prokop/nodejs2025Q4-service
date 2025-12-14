import { User } from './entities/user.entity';
import { UserResponse } from './entities/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;

    return {
      id,
      login,
      version,
      createdAt,
      updatedAt,
    };
  }
}
