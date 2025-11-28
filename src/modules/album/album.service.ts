import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, AlbumResponse } from './entities/album.entity';
import { cascadeAlbumDeletion } from '../../common/utils/cascade.util';

@Injectable()
export class AlbumService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): AlbumResponse[] {
    return this.db.albums;
  }

  findOne(id: string): AlbumResponse {
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(dto: CreateAlbumDto): AlbumResponse {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };

    this.db.albums.push(album);

    return album;
  }

  update(id: string, dto: UpdateAlbumDto): AlbumResponse {
    const album = this.db.albums.find((a) => a.id === id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (dto.name !== undefined) {
      album.name = dto.name;
    }

    if (dto.year !== undefined) {
      album.year = dto.year;
    }

    if (dto.artistId !== undefined) {
      album.artistId = dto.artistId;
    }

    return album;
  }

  remove(id: string): void {
    const index = this.db.albums.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    cascadeAlbumDeletion(this.db, id);

    this.db.albums.splice(index, 1);
  }
}
