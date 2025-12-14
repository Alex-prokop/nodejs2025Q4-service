import { Track } from '../entities/track.entity';

export abstract class TrackRepository {
  abstract findAll(): Promise<Track[]>;

  abstract findById(id: string): Promise<Track | null>;

  abstract create(track: Track): Promise<Track>;

  abstract update(track: Track): Promise<Track>;

  abstract delete(id: string): Promise<boolean>;
}
