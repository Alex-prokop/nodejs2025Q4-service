import { Injectable } from '@nestjs/common';
import { ArtistRepository } from './artist.repository';
import { DatabaseService } from '../../../common/database/database.service';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class InMemoryArtistRepository extends ArtistRepository {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async findAll(): Promise<Artist[]> {
    return this.db.artists;
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = this.db.artists.find((a) => a.id === id);
    return artist ?? null;
  }

  async create(artist: Artist): Promise<Artist> {
    this.db.artists.push(artist);
    return artist;
  }

  async update(artist: Artist): Promise<Artist> {
    const index = this.db.artists.findIndex((a) => a.id === artist.id);

    if (index === -1) {
      this.db.artists.push(artist);
      return artist;
    }

    this.db.artists[index] = artist;
    return artist;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.db.artists.findIndex((a) => a.id === id);

    if (index === -1) {
      return false;
    }

    this.db.artists.splice(index, 1);
    return true;
  }
}
