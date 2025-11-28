import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist, ArtistResponse } from './entities/artist.entity';
import { cascadeArtistDeletion } from '../../common/utils/cascade.util';

@Injectable()
export class ArtistService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): ArtistResponse[] {
    return this.db.artists;
  }

  findOne(id: string): ArtistResponse {
    const artist = this.db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  create(dto: CreateArtistDto): ArtistResponse {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };

    this.db.artists.push(artist);

    return artist;
  }

  update(id: string, dto: UpdateArtistDto): ArtistResponse {
    const artist = this.db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    if (dto.name !== undefined) {
      artist.name = dto.name;
    }

    if (dto.grammy !== undefined) {
      artist.grammy = dto.grammy;
    }

    return artist;
  }

  remove(id: string): void {
    const index = this.db.artists.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    cascadeArtistDeletion(this.db, id);

    this.db.artists.splice(index, 1);
  }
}
