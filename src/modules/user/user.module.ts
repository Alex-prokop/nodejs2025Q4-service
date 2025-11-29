import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UserModule {}
