import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { cascadeArtistDeletion } from '../../common/utils/cascade.util';
import { ArtistRepository } from './repositories/artist.repository';

@Injectable()
export class ArtistService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.findAll();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };

    return this.artistRepository.create(artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return this.artistRepository.update(artist);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.artistRepository.findById(id);

    if (!exists) {
      throw new NotFoundException('Artist not found');
    }

    cascadeArtistDeletion(this.db, id);

    await this.artistRepository.delete(id);
  }
}
