import type {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FeatureCategory} from '@atb/sdk';
import {useTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips-query';
import type {SearchLocation} from '@atb/modules/favorites';
import {useEffect, useMemo, useState} from 'react';
import type {TripPatternFragmentWithAvailability} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/types';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {
  SearchStateType,
  TripSearchTime,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {type TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {useAnalyticsContext} from '@atb/modules/analytics';

export function useTripsWithAvailability(props: {
  selection: PurchaseSelectionType;
  searchTime: TripSearchTime;
  enabled: boolean;
}) {
  const [tripPatternsWithAvailability, setTripPatternsWithAvailability] =
    useState<TripPatternFragmentWithAvailability[]>([]);
  const [offersSearchState, setOffersSearchState] =
    useState<SearchStateType>('idle');
  // useMemo to prevent unecessary rerenders
  const [from, to] = useMemo(
    () => [
      mapToSearchLocation(props.selection.stopPlaces?.from),
      mapToSearchLocation(props.selection.stopPlaces?.to),
    ],
    [props.selection],
  );
  const analytics = useAnalyticsContext();
  const filter = useMemo(
    (): TravelSearchFiltersSelectionType => ({
      transportModes: [
        {
          id: '',
          icon: {
            transportMode: TransportMode.Water,
          },
          text: [
            {
              value: '',
              lang: '',
            },
          ],
          selectedAsDefault: false,
          modes: [
            {
              transportMode: TransportMode.Water,
              transportSubModes: [TransportSubmode.HighSpeedPassengerService],
            },
          ],
          selected: true,
        },
      ],
    }),
    [],
  );
  const {tripPatterns} = useTripsQuery(
    from,
    to,
    props.searchTime,
    filter,
    props.enabled,
  );

  useEffect(() => {
    setOffersSearchState('searching');
    Promise.allSettled(
      tripPatterns.map(async (tp) => {
        const offers = await fetchOfferFromLegs(
          props.selection.travelDate
            ? new Date(props.selection.travelDate)
            : new Date(),
          mapToSalesTripPatternLegs(tp.legs),
          props.selection.userProfilesWithCount.map((up) => ({
            id: up.id,
            userType: up.userTypeString,
          })),
          [props.selection.preassignedFareProduct.id],
        );
        const bestOffer = offers.offers.find(
          (o) => o.price.amountFloat === offers.cheapestTotalPrice,
        );
        return {
          ...tp,
          available: bestOffer?.available,
        };
      }),
    ).then((results) => {
      const fulfilledResults = results.filter(isFulfilled).map((r) => r.value);
      const rejectedResults = results.filter(isRejected);

      setTripPatternsWithAvailability(fulfilledResults);
      setOffersSearchState(
        fulfilledResults.length ? 'search-success' : 'search-empty-result',
      );

      rejectedResults.forEach((rejected) => {
        analytics.logEvent(
          'Ticketing',
          'Failed to fetch offer for trip pattern',
          rejected.reason,
        );
      });
    });
    // We disable exhaustive deps here because we want to run this effect only when the tripPatterns or selection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripPatterns, props.selection]);

  return {
    tripPatterns: tripPatternsWithAvailability,
    /*
    Since a tripPattern without availability is not a tripPatternWithAvailability,
    it is not necessary to export the searchState of the tripPatterns query here.

    The only search state that is relevant is the offers-query searchState.
     */
    searchState: offersSearchState,
  };
}

export function mapToSalesTripPatternLegs(legs: TripPatternFragment['legs']) {
  return legs.map((l) => ({
    fromStopPlaceId: l.fromPlace.quay?.stopPlace?.id ?? '',
    toStopPlaceId: l.toPlace.quay?.stopPlace?.id ?? '',
    expectedStartTime: l.expectedStartTime,
    mode: l.mode,
    serviceJourneyId: l.serviceJourney?.id ?? '',
  }));
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

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

function isRejected(
  result: PromiseSettledResult<any>,
): result is PromiseRejectedResult {
  return result.status === 'rejected';
}
