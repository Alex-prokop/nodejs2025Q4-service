import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './repositories/album.repository';
import { InMemoryAlbumRepository } from './repositories/in-memory-album.repository';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    {
      provide: AlbumRepository,
      useClass: InMemoryAlbumRepository,
    },
  ],
})
export class AlbumModule {}
