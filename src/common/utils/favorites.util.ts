export function removeFromFavorites(list: string[], id: string): string[] {
  return list.filter((itemId) => itemId !== id);
}
