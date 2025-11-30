import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId?: string | null;

  @IsInt()
  @IsOptional()
  duration?: number;
}
