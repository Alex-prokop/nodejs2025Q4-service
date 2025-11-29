import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { DatabaseService } from '../../../common/database/database.service';
import { Album } from '../entities/album.entity';

@Injectable()
export class InMemoryAlbumRepository extends AlbumRepository {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async findAll(): Promise<Album[]> {
    return this.db.albums;
  }

  async findById(id: string): Promise<Album | null> {
    const album = this.db.albums.find((a) => a.id === id);
    return album ?? null;
  }

  async create(album: Album): Promise<Album> {
    this.db.albums.push(album);
    return album;
  }

  async update(album: Album): Promise<Album> {
    const index = this.db.albums.findIndex((a) => a.id === album.id);

    if (index === -1) {
      this.db.albums.push(album);
      return album;
    }

    this.db.albums[index] = album;
    return album;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.db.albums.findIndex((a) => a.id === id);

    if (index === -1) {
      return false;
    }

    this.db.albums.splice(index, 1);
    return true;
  }
}
