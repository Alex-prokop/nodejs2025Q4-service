import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../common/database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { cascadeAlbumDeletion } from '../../common/utils/cascade.util';
import { AlbumRepository } from './repositories/album.repository';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.findAll();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };

    return this.albumRepository.create(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId ?? null;

    return this.albumRepository.update(album);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.albumRepository.findById(id);

    if (!exists) {
      throw new NotFoundException('Album not found');
    }

    cascadeAlbumDeletion(this.db, id);

    await this.albumRepository.delete(id);
  }
}
