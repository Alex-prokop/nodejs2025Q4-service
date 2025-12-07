import { Injectable } from '@nestjs/common';
import type { Track as PrismaTrack } from '../../../generated/prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TrackRepository } from './track.repository';
import { Track } from '../entities/track.entity';

@Injectable()
export class PrismaTrackRepository extends TrackRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(entity: PrismaTrack): Track {
    return {
      id: entity.id,
      name: entity.name,
      duration: entity.duration,
      artistId: entity.artistId ?? null,
      albumId: entity.albumId ?? null,
    };
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks.map((t) => this.toDomain(t));
  }

  async findById(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    return track ? this.toDomain(track) : null;
  }

  async create(track: Track): Promise<Track> {
    const created = await this.prisma.track.create({
      data: {
        id: track.id,
        name: track.name,
        duration: track.duration,
        artistId: track.artistId ?? null,
        albumId: track.albumId ?? null,
      },
    });

    return this.toDomain(created);
  }

  async update(track: Track): Promise<Track> {
    const updated = await this.prisma.track.update({
      where: { id: track.id },
      data: {
        name: track.name,
        duration: track.duration,
        artistId: track.artistId ?? null,
        albumId: track.albumId ?? null,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.track.delete({ where: { id } });
      return true;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code?: string }).code === 'P2025'
      ) {
        return false;
      }
      throw err;
    }
  }
}
