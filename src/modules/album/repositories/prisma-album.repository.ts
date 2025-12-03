import { Injectable } from '@nestjs/common';
import type { Album as PrismaAlbum } from '../../../generated/prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AlbumRepository } from './album.repository';
import { Album } from '../entities/album.entity';

@Injectable()
export class PrismaAlbumRepository extends AlbumRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(entity: PrismaAlbum): Album {
    return {
      id: entity.id,
      name: entity.name,
      year: entity.year,
      artistId: entity.artistId ?? null,
    };
  }

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums.map((a) => this.toDomain(a));
  }

  async findById(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    return album ? this.toDomain(album) : null;
  }

  async create(album: Album): Promise<Album> {
    const created = await this.prisma.album.create({
      data: {
        id: album.id,
        name: album.name,
        year: album.year,
        artistId: album.artistId ?? null,
      },
    });

    return this.toDomain(created);
  }

  async update(album: Album): Promise<Album> {
    const updated = await this.prisma.album.update({
      where: { id: album.id },
      data: {
        name: album.name,
        year: album.year,
        artistId: album.artistId ?? null,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.album.delete({ where: { id } });
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
