import { Artist } from '../entities/artist.entity';

export abstract class ArtistRepository {
  abstract findAll(): Promise<Artist[]>;

  abstract findById(id: string): Promise<Artist | null>;

  abstract create(artist: Artist): Promise<Artist>;

  abstract update(artist: Artist): Promise<Artist>;

  abstract delete(id: string): Promise<boolean>;
}
