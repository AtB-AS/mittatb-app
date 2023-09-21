import {SearchLocation} from '@atb/favorites';
import {useSearchHistory} from '@atb/search-history';
import {LocationSearchResultType} from './types';

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
  previousLocations: SearchLocation[],
  onlyLocalTariffZoneAuthority: boolean = false,
): LocationSearchResultType[] => {
  return (
    previousLocations
      ?.map((location) => ({
        location,
      }))
      .filter(
        (location) =>
          !onlyLocalTariffZoneAuthority || location.location.layer == 'venue',
      ) ?? []
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
