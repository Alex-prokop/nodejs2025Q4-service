import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  users: unknown[] = [];
  artists: unknown[] = [];
  albums: unknown[] = [];
  tracks: unknown[] = [];

  favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };
}
