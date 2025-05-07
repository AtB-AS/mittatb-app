import type {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import type {SearchLocation} from '@atb/favorites';
import {FeatureCategory} from '@atb/sdk';
import {useTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips-query';
import type {DepartureSearchTime} from '@atb/place-screen';

export function useTripsWithAvailability(
  from: StopPlaceFragment,
  to: StopPlaceFragment,
  searchTime: DepartureSearchTime,
) {
  const {tripPatterns, searchState} = useTripsQuery(
    mapToSearchLocation(from),
    mapToSearchLocation(to),
    searchTime,
    undefined,
  );

  const tripPatternsWithAvailability = tripPatterns.map((tp) => ({
    ...tp,
    available: tp.available,
  }));

  return {
    tripPatterns: tripPatternsWithAvailability,
    searchState,
  };
}

function mapToSearchLocation(
  stopPlace?: StopPlaceFragment,
): SearchLocation | undefined {
  if (!stopPlace) return undefined;
  return {
    id: stopPlace.id,
    name: stopPlace.name,
    layer: 'venue',
    resultType: 'search',
    locality: '',
    category: [FeatureCategory.HARBOUR_PORT],
    coordinates: {
      latitude: stopPlace.latitude ?? 0,
      longitude: stopPlace.longitude ?? 0,
    },
  };
}
