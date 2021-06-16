import {Location, UserFavorites} from '@atb/favorites/types';
import {useSearchHistory} from '@atb/search-history';
import {LocationSearchResult} from './types';

export function useFilteredJourneySearch(searchText?: string) {
  const {journeyHistory} = useSearchHistory();

  if (!searchText) {
    return journeyHistory;
  }

  return journeyHistory.filter(
    ([a, b]) => matchLocation(searchText, a) || matchLocation(searchText, b),
  );
}

export const filterPreviousLocations = (
  searchText: string,
  previousLocations: Location[],
  favorites?: UserFavorites,
  onlyAtbVenues: boolean = false,
): LocationSearchResult[] => {
  const mappedHistory: LocationSearchResult[] =
    previousLocations
      ?.map((location) => ({
        location,
      }))
      .filter(
        (location) => !onlyAtbVenues || location.location.layer == 'venue',
      ) ?? [];

  if (!searchText) {
    return mappedHistory;
  }

  const filteredFavorites: LocationSearchResult[] = (favorites ?? [])
    .filter(
      (favorite) =>
        (matchText(searchText, favorite.location?.name) ||
          matchText(searchText, favorite.name)) &&
        (!onlyAtbVenues || favorite.location.layer == 'venue'),
    )
    .map(({location, ...favoriteInfo}) => ({
      location,
      favoriteInfo,
    }));

  return filteredFavorites.concat(
    mappedHistory.filter((l) => matchText(l.location.name)),
  );
};

const matchText = (searchText: string, text?: string) =>
  text?.toLowerCase()?.startsWith(searchText.toLowerCase());
const matchLocation = (searchText: string, location: Location) =>
  matchText(searchText, location.name);

export const filterCurrentLocation = (
  locations: Location[] | null,
  previousLocations: LocationSearchResult[] | null,
): LocationSearchResult[] => {
  if (!previousLocations?.length || !locations)
    return locations?.map((location) => ({location})) ?? [];
  return locations
    .filter((l) => !previousLocations.some((pl) => pl.location.id === l.id))
    .map((location) => ({location}));
};
