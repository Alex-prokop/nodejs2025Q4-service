import { DatabaseService } from '../database/database.service';
import { removeFromFavorites } from './favorites.util';

export function cascadeArtistDeletion(db: DatabaseService, artistId: string) {
  db.albums.forEach((album) => {
    if (album.artistId === artistId) {
      album.artistId = null;
    }
  });

  db.tracks.forEach((track) => {
    if (track.artistId === artistId) {
      track.artistId = null;
    }
  });

  db.favorites.artists = removeFromFavorites(db.favorites.artists, artistId);
}

export function cascadeAlbumDeletion(db: DatabaseService, albumId: string) {
  db.tracks.forEach((track) => {
    if (track.albumId === albumId) {
      track.albumId = null;
    }
  });

  db.favorites.albums = removeFromFavorites(db.favorites.albums, albumId);
}

export function cascadeTrackDeletion(db: DatabaseService, trackId: string) {
  db.favorites.tracks = removeFromFavorites(db.favorites.tracks, trackId);
}
