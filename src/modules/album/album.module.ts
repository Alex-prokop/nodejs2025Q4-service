import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './repositories/album.repository';
// import { InMemoryAlbumRepository } from './repositories/in-memory-album.repository';
import { PrismaAlbumRepository } from './repositories/prisma-album.repository';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    {
      provide: AlbumRepository,
      useClass: PrismaAlbumRepository,
    },
  ],
  exports: [AlbumRepository],
})
export class AlbumModule {}
