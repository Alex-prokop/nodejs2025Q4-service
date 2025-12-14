import { Album } from '../entities/album.entity';

export abstract class AlbumRepository {
  abstract findAll(): Promise<Album[]>;

  abstract findById(id: string): Promise<Album | null>;

  abstract create(album: Album): Promise<Album>;

  abstract update(album: Album): Promise<Album>;

  abstract delete(id: string): Promise<boolean>;
}
