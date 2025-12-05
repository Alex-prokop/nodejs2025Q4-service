import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
// import { DatabaseService } from '../../common/database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { cascadeTrackDeletion } from '../../common/utils/cascade.util';
import { TrackRepository } from './repositories/track.repository';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.findAll();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };

    return this.trackRepository.create(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = dto.name;
    track.artistId = dto.artistId ?? null;
    track.albumId = dto.albumId ?? null;
    track.duration = dto.duration;

    return this.trackRepository.update(track);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.trackRepository.findById(id);

    if (!exists) {
      throw new NotFoundException('Track not found');
    }

    cascadeTrackDeletion(this.prisma, id);

    await this.trackRepository.delete(id);
  }
}
