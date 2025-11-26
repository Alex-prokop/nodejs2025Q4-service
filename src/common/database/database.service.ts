import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';
import { Artist } from '../../modules/artist/entities/artist.entity';
import { Album } from '../../modules/album/entities/album.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: unknown[] = [];

  favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };
}
