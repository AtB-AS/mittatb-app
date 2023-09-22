import {
  SearchLocation,
  StoredLocationFavorite,
  UserFavorites,
} from '@atb/favorites';
import {useSearchHistory} from '@atb/search-history';
import {LocationSearchResultType} from './types';
import {getLocationLayer} from '@atb/utils/location';

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
  previousLocations: SearchLocation[],
  favorites?: UserFavorites,
  onlyLocalTariffZoneAuthority: boolean = false,
): LocationSearchResultType[] => {
  const mappedHistory: LocationSearchResultType[] =
    previousLocations
      ?.map((location) => ({
        location,
      }))
      .filter(
        (location) =>
          !onlyLocalTariffZoneAuthority || location.location.layer == 'venue',
      ) ?? [];

  if (!searchText) {
    return mappedHistory;
  }

  const filteredFavorites: LocationSearchResultType[] = (favorites ?? [])
    .filter(
      (
        favorite,
      ): favorite is Omit<StoredLocationFavorite, 'location'> & {
        location: SearchLocation;
      } =>
        (matchText(searchText, favorite.location.name) ||
          matchText(searchText, favorite.name)) &&
        (!onlyLocalTariffZoneAuthority ||
          getLocationLayer(favorite.location) == 'venue') &&
        favorite.location.resultType === 'search',
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
  text?.toLowerCase()?.startsWith(searchText.toLowerCase()) || false;
const matchLocation = (searchText: string, location: SearchLocation) =>
  matchText(searchText, location.name);

export const filterCurrentLocation = (
  locations: SearchLocation[] | null,
  previousLocations: LocationSearchResultType[] | null,
): LocationSearchResultType[] => {
  if (!previousLocations?.length || !locations)
    return locations?.map((location) => ({location})) ?? [];
  return locations
    .filter((l) => !previousLocations.some((pl) => pl.location.id === l.id))
    .map((location) => ({location}));
};
