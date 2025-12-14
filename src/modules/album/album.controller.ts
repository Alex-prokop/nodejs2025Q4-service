import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAll(): Promise<Album[]> {
    const albums = await this.albumService.findAll();
    return albums;
  }

  @Get(':id')
  async findOne(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<Album> {
    const album = await this.albumService.findOne(id);
    return album;
  }

  @Post()
  async create(@Body() dto: CreateAlbumDto): Promise<Album> {
    const album = await this.albumService.create(dto);
    return album;
  }

  @Put(':id')
  async update(
    @Param('id', UuidParamPipe)
    id: string,
    @Body() dto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.albumService.update(id, dto);
    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<void> {
    await this.albumService.remove(id);
  }
}
