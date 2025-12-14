import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesRepository } from './repositories/favorites.repository';
import { ArtistRepository } from '../artist/repositories/artist.repository';
import { AlbumRepository } from '../album/repositories/album.repository';
import { TrackRepository } from '../track/repositories/track.repository';
import { FavoritesResponse } from './entities/favorites.entity';
import { removeFromFavorites } from '../../common/utils/favorites.util';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly trackRepository: TrackRepository,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesRepository.getFavorites();

    const [artists, albums, tracks] = await Promise.all([
      Promise.all(
        favorites.artists.map((id) => this.artistRepository.findById(id)),
      ),
      Promise.all(
        favorites.albums.map((id) => this.albumRepository.findById(id)),
      ),
      Promise.all(
        favorites.tracks.map((id) => this.trackRepository.findById(id)),
      ),
    ]);

    return {
      artists: artists.filter((a): a is NonNullable<typeof a> => Boolean(a)),
      albums: albums.filter((a): a is NonNullable<typeof a> => Boolean(a)),
      tracks: tracks.filter((t): t is NonNullable<typeof t> => Boolean(t)),
    };
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findById(id);

    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
      await this.favoritesRepository.setFavorites(favorites);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.tracks.includes(id)) {
      throw new NotFoundException('Track is not favorite');
    }

    favorites.tracks = removeFromFavorites(favorites.tracks, id);
    await this.favoritesRepository.setFavorites(favorites);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findById(id);

    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
      await this.favoritesRepository.setFavorites(favorites);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.albums.includes(id)) {
      throw new NotFoundException('Album is not favorite');
    }

    favorites.albums = removeFromFavorites(favorites.albums, id);
    await this.favoritesRepository.setFavorites(favorites);
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findById(id);

    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
      await this.favoritesRepository.setFavorites(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favorites = await this.favoritesRepository.getFavorites();

    if (!favorites.artists.includes(id)) {
      throw new NotFoundException('Artist is not favorite');
    }

    favorites.artists = removeFromFavorites(favorites.artists, id);
    await this.favoritesRepository.setFavorites(favorites);
  }
}
