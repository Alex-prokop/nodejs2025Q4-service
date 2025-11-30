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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';
import { Track } from './entities/track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll(): Promise<Track[]> {
    const tracks = await this.trackService.findAll();
    return tracks;
  }

  @Get(':id')
  async findOne(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<Track> {
    const track = await this.trackService.findOne(id);
    return track;
  }

  @Post()
  async create(@Body() dto: CreateTrackDto): Promise<Track> {
    const track = await this.trackService.create(dto);
    return track;
  }

  @Put(':id')
  async update(
    @Param('id', UuidParamPipe)
    id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<Track> {
    const track = await this.trackService.update(id, dto);
    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<void> {
    await this.trackService.remove(id);
  }
}
