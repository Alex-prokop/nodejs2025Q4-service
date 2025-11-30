import { Favorites } from '../entities/favorites.entity';

export abstract class FavoritesRepository {
  abstract getFavorites(): Promise<Favorites>;

  abstract setFavorites(favorites: Favorites): Promise<void>;
}
