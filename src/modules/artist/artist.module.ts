import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './repositories/artist.repository';
// import { InMemoryArtistRepository } from './repositories/in-memory-artist.repository';
import { PrismaArtistRepository } from './repositories/prisma-artist.repository';

@Module({
  controllers: [ArtistController],
  providers: [
    ArtistService,
    {
      provide: ArtistRepository,
      useClass: PrismaArtistRepository,
    },
  ],
  exports: [ArtistRepository],
})
export class ArtistModule {}
