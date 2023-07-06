import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useEffect, useRef, useState} from 'react';
import {SearchStateType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {CancelTokenSource} from 'axios';
import {nonTransitTripSearch} from '@atb/api/trips';
import {
  createQuery,
  sanitizeSearchTime,
  SearchInput,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/utils';
import {usePreferences} from '@atb/preferences';
import {CancelToken} from '@atb/api';
import {isValidTripLocations} from '@atb/utils/location';
import {NonTransitTripsQuery} from '@atb/api/types/generated/TripsQuery';

export const useNonTransitTripsQuery = (
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
  filtersSelection: TravelSearchFiltersSelectionType | undefined,
) => {
  const [nonTransitTrips, setNonTransitTrips] = useState<
    NonTransitTripsQuery[]
  >([]);
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const cancelTokenRef = useRef<CancelTokenSource>();
  const {
    preferences: {tripSearchPreferences},
  } = usePreferences();

  useEffect(() => {
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

    const query = createQuery(
      fromLocation,
      toLocation,
      searchInput,
      arriveBy,
      tripSearchPreferences,
      filtersSelection,
    );

    nonTransitTripSearch(
      {
        ...query,
        // TODO: get modes from filter
        modes: [StreetMode.Foot, StreetMode.BikeRental, StreetMode.Bicycle],
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
    fromLocation,
    toLocation,
    searchTime,
    tripSearchPreferences,
    filtersSelection,
  ]);

  return {
    nonTransitTrips,
    searchState: searchState,
  };
};
