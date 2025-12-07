import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackRepository } from './repositories/track.repository';
// import { InMemoryTrackRepository } from './repositories/in-memory-track.repository';
import { PrismaTrackRepository } from './repositories/prisma-track.repository';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    {
      provide: TrackRepository,
      useClass: PrismaTrackRepository,
    },
  ],
  exports: [TrackRepository],
})
export class TrackModule {}
