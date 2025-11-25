import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: unknown[] = [];
  albums: unknown[] = [];
  tracks: unknown[] = [];

  favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };
}
