import { Injectable } from '@nestjs/common';
import type { Artist as PrismaArtist } from '../../../generated/prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ArtistRepository } from './artist.repository';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class PrismaArtistRepository extends ArtistRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(entity: PrismaArtist): Artist {
    return {
      id: entity.id,
      name: entity.name,
      grammy: entity.grammy,
    };
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists.map((a) => this.toDomain(a));
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    return artist ? this.toDomain(artist) : null;
  }

  async create(artist: Artist): Promise<Artist> {
    const created = await this.prisma.artist.create({
      data: {
        id: artist.id,
        name: artist.name,
        grammy: artist.grammy,
      },
    });

    return this.toDomain(created);
  }

  async update(artist: Artist): Promise<Artist> {
    const updated = await this.prisma.artist.update({
      where: { id: artist.id },
      data: {
        name: artist.name,
        grammy: artist.grammy,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.artist.delete({ where: { id } });
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
