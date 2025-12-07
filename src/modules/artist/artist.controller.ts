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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    const artists = await this.artistService.findAll();
    return artists;
  }

  @Get(':id')
  async findOne(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<Artist> {
    const artist = await this.artistService.findOne(id);
    return artist;
  }

  @Post()
  async create(@Body() dto: CreateArtistDto): Promise<Artist> {
    const artist = await this.artistService.create(dto);
    return artist;
  }

  @Put(':id')
  async update(
    @Param('id', UuidParamPipe)
    id: string,
    @Body() dto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.artistService.update(id, dto);
    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<void> {
    await this.artistService.remove(id);
  }
}
