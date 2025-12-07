import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId?: string | null;

  @IsInt()
  duration: number;
}
