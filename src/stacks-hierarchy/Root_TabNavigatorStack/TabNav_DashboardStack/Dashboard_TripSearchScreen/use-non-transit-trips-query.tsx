import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useEffect, useRef, useState} from 'react';
import {SearchStateType} from '../types';
import {CancelTokenSource} from 'axios';
import {nonTransitTripSearch} from '@atb/api/trips';
import {sanitizeSearchTime, SearchInput} from './utils';
import {CancelToken} from '@atb/api';
import {isValidTripLocations} from '@atb/utils/location';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {NonTransitTripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';
import {TravelSearchPreferenceWithSelectionType} from '@atb/travel-search-filters/types';
import {TravelSearchPreferenceParameterType} from '@atb-as/config-specs';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

export const useNonTransitTripsQuery = (
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
  filtersSelection: TravelSearchFiltersSelectionType | undefined,
) => {
  const [nonTransitTrips, setNonTransitTrips] = useState<TripPatternFragment[]>(
    [],
  );
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const cancelTokenRef = useRef<CancelTokenSource>();
  const {isNonTransitTripSearchEnabled} = useFeatureTogglesContext();

  useEffect(() => {
    if (!isNonTransitTripSearchEnabled) return;

    setSearchState('searching');

    if (
      !fromLocation ||
      !toLocation ||
      !isValidTripLocations(fromLocation, toLocation)
    ) {
      setNonTransitTrips([]);
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
      filtersSelection,
      [StreetMode.Foot, StreetMode.BikeRental, StreetMode.Bicycle],
    );

    nonTransitTripSearch(query, {cancelToken: cancelTokenSource.token})
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
    fromLocation,
    toLocation,
    searchTime,
    filtersSelection,
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
  filtersSelection: TravelSearchFiltersSelectionType | undefined,
  directModes: StreetMode[],
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
  const walkSpeed = getPreferenceFromFilter(
    'walkSpeed',
    filtersSelection?.travelSearchPreferences,
  );

  return {
    from,
    to,
    when: searchTime?.date,
    arriveBy,
    walkSpeed,
    directModes,
  };
}

const getPreferenceFromFilter = (
  type: TravelSearchPreferenceParameterType,
  filters: TravelSearchPreferenceWithSelectionType[] | undefined,
) => {
  const filterOfType = filters?.find((f) => f.type === type);
  if (!filterOfType) return;
  return filterOfType.options.find((o) => o.id === filterOfType.selectedOption)
    ?.value;
};
