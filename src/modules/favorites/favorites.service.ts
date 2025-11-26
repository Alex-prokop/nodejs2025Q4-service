import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { FavoritesResponse } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  getAll(): FavoritesResponse {
    const favorites = this.db.favorites;

    const artists = this.db.artists.filter((artist) =>
      favorites.artists.includes(artist.id),
    );

    const albums = this.db.albums.filter((album) =>
      favorites.albums.includes(album.id),
    );

    const tracks = this.db.tracks.filter((track) =>
      favorites.tracks.includes(track.id),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(id: string): void {
    const track = this.db.tracks.find((t) => t.id === id);

    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    if (!this.db.favorites.tracks.includes(id)) {
      this.db.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.db.favorites.tracks.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Track is not favorite');
    }

    this.db.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    if (!this.db.favorites.albums.includes(id)) {
      this.db.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.db.favorites.albums.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Album is not favorite');
    }

    this.db.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    const artist = this.db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    if (!this.db.favorites.artists.includes(id)) {
      this.db.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.db.favorites.artists.indexOf(id);

    if (index === -1) {
      throw new NotFoundException('Artist is not favorite');
    }

    this.db.favorites.artists.splice(index, 1);
  }
}
