import {Location} from '@atb/modules/favorites';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useMemo} from 'react';
import {SearchStateType, TripSearchTime} from '../types';
import {sanitizeSearchTime} from './utils';
import {isValidTripLocations} from '@atb/utils/location';
import {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  NonTransitTripsQueryProps,
  useNonTransitTripsQuery,
} from './use-non-transit-trips-query';

export const useNonTransitTrips = (
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: TripSearchTime,
  travelSearchFiltersSelection: TravelSearchFiltersSelectionType | undefined,
) => {
  const {isNonTransitTripSearchEnabled} = useFeatureTogglesContext();
  const nonTransitTripLocationsAreValid = isValidTripLocations(
    fromLocation,
    toLocation,
  );
  const nonTransitTripsQueryEnabled =
    nonTransitTripLocationsAreValid && isNonTransitTripSearchEnabled;

  const arriveBy = searchTime.option === 'arrival';

  const sanitizedSearchTime = useMemo(
    () => sanitizeSearchTime(searchTime),
    [searchTime],
  );

  const nonTransitTripsQueryProps: NonTransitTripsQueryProps = useMemo(
    () => ({
      fromLocation,
      toLocation,
      searchTime: sanitizedSearchTime,
      arriveBy,
      travelSearchFiltersSelection,
      directModes: [StreetMode.Foot, StreetMode.BikeRental, StreetMode.Bicycle],
    }),
    [
      arriveBy,
      fromLocation,
      sanitizedSearchTime,
      toLocation,
      travelSearchFiltersSelection,
    ],
  );

  const {
    data: nonTransitTripsData,
    isFetching: nonTransitTripsIsFetching,
    isFetched: nonTransitTripsIsFetched,
  } = useNonTransitTripsQuery(
    nonTransitTripsQueryProps,
    nonTransitTripsQueryEnabled,
  );

  const nonTransitTripPatterns = useMemo(
    () => nonTransitTripsData ?? [],
    [nonTransitTripsData],
  );
  const hasSearched = nonTransitTripsIsFetched;
  const resultsAreEmpty =
    !nonTransitTripLocationsAreValid ||
    (hasSearched && nonTransitTripPatterns.length === 0);

  const nonTransitTripsSearchState: SearchStateType = nonTransitTripsIsFetching
    ? 'searching'
    : resultsAreEmpty
      ? 'search-empty-result'
      : hasSearched
        ? 'search-success'
        : 'idle';

  return useMemo(
    () => ({
      nonTransitTripPatterns,
      nonTransitTripsSearchState,
    }),
    [nonTransitTripPatterns, nonTransitTripsSearchState],
  );
};
