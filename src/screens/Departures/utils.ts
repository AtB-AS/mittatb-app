import {UserFavoriteDepartures} from '@atb/favorites/types';

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

export function hasFavorites(
  favorites: UserFavoriteDepartures,
  stopPlaceId?: string,
  quayIds?: string[],
) {
  return favorites.some(
    (favorite) =>
      stopPlaceId === favorite.stopId ||
      quayIds?.some((quayId) => favorite.quayId === quayId),
  );
}
