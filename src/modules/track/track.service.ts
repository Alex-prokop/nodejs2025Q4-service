import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track, TrackResponse } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): TrackResponse[] {
    return this.db.tracks;
  }

  findOne(id: string): TrackResponse {
    const track = this.db.tracks.find((t) => t.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(dto: CreateTrackDto): TrackResponse {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };

    this.db.tracks.push(track);

    return track;
  }

  update(id: string, dto: UpdateTrackDto): TrackResponse {
    const track = this.db.tracks.find((t) => t.id === id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    if (dto.name !== undefined) {
      track.name = dto.name;
    }

    if (dto.artistId !== undefined) {
      track.artistId = dto.artistId;
    }

    if (dto.albumId !== undefined) {
      track.albumId = dto.albumId;
    }

    if (dto.duration !== undefined) {
      track.duration = dto.duration;
    }

    return track;
  }

  remove(id: string): void {
    const index = this.db.tracks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.db.favorites.tracks = this.db.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );

    this.db.tracks.splice(index, 1);
  }
}
