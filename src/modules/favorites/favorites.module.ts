import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { FavoritesRepository } from './repositories/favorites.repository';
// import { InMemoryFavoritesRepository } from './repositories/in-memory-favorites.repository';
import { PrismaFavoritesRepository } from './repositories/prisma-favorites.repository';

import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
@Module({
  imports: [ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    {
      provide: FavoritesRepository,
      useClass: PrismaFavoritesRepository,
    },
  ],
})
export class FavoritesModule {}
