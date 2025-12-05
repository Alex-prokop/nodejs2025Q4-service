import { PrismaService } from '../prisma/prisma.service';

export async function cascadeArtistDeletion(
  prisma: PrismaService,
  artistId: string,
): Promise<void> {
  await prisma.album.updateMany({
    where: { artistId },
    data: { artistId: null },
  });

  await prisma.track.updateMany({
    where: { artistId },
    data: { artistId: null },
  });

  const favoritesRow = await prisma.favorites.findUnique({
    where: { id: 1 },
  });

  if (favoritesRow && favoritesRow.artists.includes(artistId)) {
    const newArtists = favoritesRow.artists.filter((id) => id !== artistId);

    await prisma.favorites.update({
      where: { id: favoritesRow.id },
      data: {
        artists: {
          set: newArtists,
        },
      },
    });
  }
}

export async function cascadeAlbumDeletion(
  prisma: PrismaService,
  albumId: string,
): Promise<void> {
  await prisma.track.updateMany({
    where: { albumId },
    data: { albumId: null },
  });

  const favoritesRow = await prisma.favorites.findUnique({
    where: { id: 1 },
  });

  if (favoritesRow && favoritesRow.albums.includes(albumId)) {
    const newAlbums = favoritesRow.albums.filter((id) => id !== albumId);

    await prisma.favorites.update({
      where: { id: favoritesRow.id },
      data: {
        albums: {
          set: newAlbums,
        },
      },
    });
  }
}

export async function cascadeTrackDeletion(
  prisma: PrismaService,
  trackId: string,
): Promise<void> {
  const favoritesRow = await prisma.favorites.findUnique({
    where: { id: 1 },
  });

  if (favoritesRow && favoritesRow.tracks.includes(trackId)) {
    const newTracks = favoritesRow.tracks.filter((id) => id !== trackId);

    await prisma.favorites.update({
      where: { id: favoritesRow.id },
      data: {
        tracks: {
          set: newTracks,
        },
      },
    });
  }
}
