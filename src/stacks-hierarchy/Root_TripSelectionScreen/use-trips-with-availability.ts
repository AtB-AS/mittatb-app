import type {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FeatureCategory} from '@atb/sdk';
import {useTripsQuery} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips-query';
import type {SearchLocation} from '@atb/modules/favorites';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {useEffect, useMemo, useState} from 'react';
import type {TripPatternFragmentWithAvailability} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/types';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripSearchTime} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {TransportMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {type TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';

export function useTripsWithAvailability(props: {
  selection: PurchaseSelectionType;
  searchTime: TripSearchTime;
}) {
  const [tripPatternsWithAvailability, setTripPatternsWithAvailability] =
    useState<TripPatternFragmentWithAvailability[]>([]);
  // useMemo to prevent unecessary rerenders
  const [from, to] = useMemo(
    () => [
      mapToSearchLocation(props.selection.stopPlaces?.from),
      mapToSearchLocation(props.selection.stopPlaces?.to),
    ],
    [props.selection],
  );
  const filter = useMemo(
    (): TravelSearchFiltersSelectionType => ({
      transportModes: [
        {
          id: '',
          icon: {
            transportMode: TransportMode.Bus,
            //transportSubMode: TransportSubmode.HighSpeedPassengerService,
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
            },
          ],
          selected: true,
        },
      ],
    }),
    [],
  );
  const {tripPatterns, searchState} = useTripsQuery(
    from,
    to,
    props.searchTime,
    filter,
  );

  useEffect(() => {
    Promise.all(
      tripPatterns
        //.filter((tp) => !tp.legs.some((l) => l.mode === Mode.Water))
        .map(async (tp) => {
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
    ).then((result) => setTripPatternsWithAvailability(result));
  }, [tripPatterns, props.selection]);

  return {
    tripPatterns: tripPatternsWithAvailability,
    searchState,
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
