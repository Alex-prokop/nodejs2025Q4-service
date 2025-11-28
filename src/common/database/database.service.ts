import { Injectable } from '@nestjs/common';
import { User } from '../../modules/user/entities/user.entity';
import { Artist } from '../../modules/artist/entities/artist.entity';
import { Album } from '../../modules/album/entities/album.entity';
import { Track } from '../../modules/track/entities/track.entity';
import { Favorites } from '../../modules/favorites/entities/favorites.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];

  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
