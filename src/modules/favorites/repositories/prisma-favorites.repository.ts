import { Injectable } from '@nestjs/common';
import type { Favorites as PrismaFavorites } from '../../../generated/prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FavoritesRepository } from './favorites.repository';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class PrismaFavoritesRepository extends FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toDomain(entity: PrismaFavorites): Favorites {
    return {
      artists: entity.artists,
      albums: entity.albums,
      tracks: entity.tracks,
    };
  }

  private getDefault(): Favorites {
    return {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  private async getOrCreateRow(): Promise<PrismaFavorites> {
    const existing = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });

    if (existing) return existing;

    return this.prisma.favorites.create({
      data: {
        id: 1,
        artists: [],
        albums: [],
        tracks: [],
      },
    });
  }

  async getFavorites(): Promise<Favorites> {
    const row = await this.getOrCreateRow();
    return this.toDomain(row);
  }

  async setFavorites(favorites: Favorites): Promise<void> {
    await this.prisma.favorites.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        artists: favorites.artists ?? [],
        albums: favorites.albums ?? [],
        tracks: favorites.tracks ?? [],
      },
      update: {
        artists: favorites.artists ?? [],
        albums: favorites.albums ?? [],
        tracks: favorites.tracks ?? [],
      },
    });
  }
}
