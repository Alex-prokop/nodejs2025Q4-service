import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';
import { Artist } from '../../modules/artist/entities/artist.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: Artist[] = [];
  albums: unknown[] = [];
  tracks: unknown[] = [];

  favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };
}
