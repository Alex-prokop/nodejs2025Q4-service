import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { DatabaseService } from '../../../common/database/database.service';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class InMemoryFavoritesRepository extends FavoritesRepository {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async getFavorites(): Promise<Favorites> {
    return this.db.favorites;
  }

  async setFavorites(favorites: Favorites): Promise<void> {
    this.db.favorites = favorites;
  }
}
