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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe';
import { UserResponse } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserResponse[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async findOne(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.create(dto);
    return user;
  }

  @Put(':id')
  async updatePassword(
    @Param('id', UuidParamPipe)
    id: string,
    @Body() dto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userService.updatePassword(id, dto);
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', UuidParamPipe)
    id: string,
  ): Promise<void> {
    await this.userService.remove(id);
  }
}
