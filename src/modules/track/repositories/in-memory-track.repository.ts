import { Injectable } from '@nestjs/common';
import { TrackRepository } from './track.repository';
import { DatabaseService } from '../../../common/database/database.service';
import { Track } from '../entities/track.entity';

@Injectable()
export class InMemoryTrackRepository extends TrackRepository {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async findAll(): Promise<Track[]> {
    return this.db.tracks;
  }

  async findById(id: string): Promise<Track | null> {
    const track = this.db.tracks.find((t) => t.id === id);
    return track ?? null;
  }

  async create(track: Track): Promise<Track> {
    this.db.tracks.push(track);
    return track;
  }

  async update(track: Track): Promise<Track> {
    const index = this.db.tracks.findIndex((t) => t.id === track.id);

    if (index === -1) {
      this.db.tracks.push(track);
      return track;
    }

    this.db.tracks[index] = track;
    return track;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.db.tracks.findIndex((t) => t.id === id);

    if (index === -1) {
      return false;
    }

    this.db.tracks.splice(index, 1);
    return true;
  }
}
