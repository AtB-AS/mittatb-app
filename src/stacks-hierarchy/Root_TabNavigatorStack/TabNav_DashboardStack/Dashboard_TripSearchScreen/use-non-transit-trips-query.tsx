import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useEffect, useRef, useState} from 'react';
import {SearchStateType} from '../types';
import {CancelTokenSource} from 'axios';
import {nonTransitTripSearch} from '@atb/api/trips';
import {sanitizeSearchTime, SearchInput} from './utils';
import {TripSearchPreferences, usePreferences} from '@atb/preferences';
import {CancelToken} from '@atb/api';
import {isValidTripLocations} from '@atb/utils/location';
import {useNonTransitTripSearchEnabled} from './use-non-transit-trip-search-enabled';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {NonTransitTripsQueryVariables} from '@atb/api/types/generated/TripsQuery';

export const useNonTransitTripsQuery = (
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
) => {
  const [nonTransitTrips, setNonTransitTrips] = useState<TripPatternFragment[]>(
    [],
  );
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const cancelTokenRef = useRef<CancelTokenSource>();
  const {
    preferences: {tripSearchPreferences},
  } = usePreferences();
  const [
    isNonTransitTripSearchEnabled,
    nonTransitTripSearchDebugOverrideReady,
  ] = useNonTransitTripSearchEnabled();

  useEffect(() => {
    if (
      !isNonTransitTripSearchEnabled ||
      !nonTransitTripSearchDebugOverrideReady
    )
      return;

    setSearchState('searching');

    if (
      !fromLocation ||
      !toLocation ||
      !isValidTripLocations(fromLocation, toLocation)
    ) {
      setSearchState('search-empty-result');
      return;
    }

    cancelTokenRef.current?.cancel('New search starting');
    const cancelTokenSource = CancelToken.source();

    const searchInput: SearchInput = {
      searchTime: sanitizeSearchTime(searchTime),
    };

    const arriveBy = searchTime.option === 'arrival';

    const query = createNonTransitQuery(
      fromLocation,
      toLocation,
      searchInput,
      arriveBy,
      tripSearchPreferences,
    );

    nonTransitTripSearch(
      {
        ...query,
        directModes: [StreetMode.Foot, StreetMode.Bicycle],
      },
      {cancelToken: cancelTokenSource.token},
    )
      .then((result) => {
        setNonTransitTrips(result);
        setSearchState(
          result?.length === 0 ? 'search-empty-result' : 'search-success',
        );
      })
      .catch(() => {
        cancelTokenRef.current = cancelTokenSource;
        // Purposely ignore errors from non transit trip searches.
        // Non transit trip searches are not a critical feature,
        // and failing silently will thus not affect the user experience severely.
        // If travel search fails in general, the error handling in the normal
        // travel search will display an error message to the user.
      });

    return () => {
      cancelTokenSource.cancel('Unmounting use trips hook');
    };
  }, [
    isNonTransitTripSearchEnabled,
    nonTransitTripSearchDebugOverrideReady,
    fromLocation,
    toLocation,
    searchTime,
    tripSearchPreferences,
  ]);

  return {
    nonTransitTrips,
    searchState: searchState,
  };
};

export function createNonTransitQuery(
  fromLocation: Location,
  toLocation: Location,
  {searchTime}: SearchInput,
  arriveBy: boolean,
  tripSearchPreferences: TripSearchPreferences | undefined,
): NonTransitTripsQueryVariables {
  const from = {
    ...fromLocation,
    place:
      fromLocation.resultType === 'search' && fromLocation.layer === 'venue'
        ? fromLocation.id
        : undefined,
  };
  const to = {
    ...toLocation,
    place:
      toLocation.resultType === 'search' && toLocation.layer === 'venue'
        ? toLocation.id
        : undefined,
  };

  return {
    from,
    to,
    when: searchTime?.date,
    arriveBy,
    walkSpeed: tripSearchPreferences?.walkSpeed,
    directModes: [StreetMode.Foot, StreetMode.Bicycle],
  };
}
