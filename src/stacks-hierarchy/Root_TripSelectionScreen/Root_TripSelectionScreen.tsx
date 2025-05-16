import {GenericSectionItem, RadioGroupSection} from '@atb/components/sections';
import React, {useEffect, useState} from 'react';
import {
  type Location,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import type {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {tripsSearch} from '@atb/api/trips';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import type {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {FullScreenView} from '@atb/components/screen-view';
import {useThemeContext} from '@atb/theme';
import {fetchOfferFromLegs} from '@atb/api/sales';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import {formatToClock} from '@atb/utils/date';
import {Language} from '@atb/translations';
import {endOfDay} from 'date-fns';
import type {SalesTripPatternLeg} from '@atb/api/types/sales';
import {Button} from '@atb/components/button';
import type {DepartureSearchTime} from '@atb/screen-components/place-screen';
import {DateSelection} from '@atb/screen-components/place-screen/components/DateSelection';

type Props = RootStackScreenProps<'Root_TripSelectionScreen'>;

type TripPatternFragmentWithAvailability = TripPatternFragment & {
  available: number | undefined;
};

export const Root_TripSelectionScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const [tripPatterns, setTripPatterns] = useState<
    TripPatternFragmentWithAvailability[]
  >([]);
  const [selection] = useParamAsState(params.selection);
  const [selected, setSelected] =
    useState<TripPatternFragmentWithAvailability>();
  const [searchTime, setSearchTime] = useState<DepartureSearchTime>({
    date: new Date().toISOString(),
    option: 'now',
  });
  const {theme} = useThemeContext();

  const selectionBuilder = usePurchaseSelectionBuilder();

  async function fetchOffers(from: Location, to: Location) {
    const queryVariables: TripsQueryVariables = {
      from,
      to,
      arriveBy: false,
      when: searchTime.date,
      modes: {
        transportModes: [
          {
            transportMode: TransportMode.Water,
          },
        ],
      },
    };
    const tripPatterns: TripPatternFragment[] = [];
    let nextCursor: string | undefined;
    let done = false;
    while (!done) {
      const result = await tripsSearch({...queryVariables, cursor: nextCursor});
      nextCursor = result.trip.nextPageCursor;
      result.trip.tripPatterns.forEach((tp) => {
        const date = new Date(tp.expectedStartTime);
        if (date > endOfDay(searchTime.date)) {
          done = true;
        } else {
          tripPatterns.push(tp);
        }
      });
    }

    try {
      const tps = await Promise.all(
        tripPatterns.map(async (tp) => {
          const offer = await fetchOfferFromLegs(
            new Date(tp.expectedStartTime),
            mapToSalesTripPatternLegs(tp),
            selection.userProfilesWithCount.map((up) => ({
              id: up.id,
              userType: up.userTypeString,
            })),
            [selection.preassignedFareProduct.id],
          );

          const bestOffer = offer.offers.find(
            (o) => Number(o.price.amount) === offer.cheapestTotalPrice,
          );

          return {
            ...tp,
            available: bestOffer?.available ?? undefined,
          };
        }),
      );
      setTripPatterns(tps);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (selection.stopPlaces?.from && selection.stopPlaces.to) {
      fetchOffers(
        {place: selection.stopPlaces.from.id},
        {place: selection.stopPlaces.to.id},
      );
    } else {
      setTripPatterns([]);
    }
  }, [selection, searchTime]);

  return (
    <FullScreenView
      headerProps={{
        title: 'Velg avgang',
        leftButton: {
          type: 'back',
          onPress: () => navigation.pop(),
        },
      }}
    >
      <DateSelection
        searchTime={searchTime}
        setSearchTime={setSearchTime}
        backgroundColor={theme.color.background.neutral[1]}
      />
      <GenericSectionItem
        style={{
          borderRadius: theme.border.radius.regular,
          margin: theme.spacing.small,
        }}
      >
        <RadioGroupSection
          style={{
            width: '100%',
          }}
          items={tripPatterns}
          keyExtractor={(tp) => tp.expectedStartTime}
          itemToText={(tp) =>
            `${formatToClock(
              tp.expectedStartTime,
              Language.Norwegian,
              'floor',
            )} - ${formatToClock(
              tp.expectedEndTime,
              Language.Norwegian,
              'floor',
            )} (${
              tp.legs[0]?.fromEstimatedCall?.destinationDisplay?.frontText
            })`
          }
          itemToSubtext={(tp) => {
            if (!tp.available) return undefined;
            return `${tp.available} ledige plasser`;
          }}
          itemToA11yLabel={(tp) =>
            tp.legs[0]?.fromEstimatedCall?.destinationDisplay?.frontText
          }
          headerText={`${selection.stopPlaces?.from?.name} til ${selection.stopPlaces?.to?.name}`}
          selected={selected}
          onSelect={(tp) => setSelected(tp)}
        />
      </GenericSectionItem>
      <Button
        onPress={() => {
          if (selected) {
            const newSelection = selectionBuilder
              .fromSelection(selection)
              .legs(mapToSalesTripPatternLegs(selected))
              .build();
            navigation.navigate({
              name: 'Root_PurchaseOverviewScreen',
              params: {
                mode: 'Ticket',
                selection: newSelection,
              },
              merge: true,
            });
          }
        }}
        expanded={false}
        text="Bekreft"
      />
    </FullScreenView>
  );
};

function mapToSalesTripPatternLegs(
  tp: TripPatternFragment,
): SalesTripPatternLeg[] {
  return tp.legs.map((leg) => ({
    expectedStartTime: leg.expectedStartTime,
    fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id ?? '',
    toStopPlaceId: leg.toPlace.quay?.stopPlace?.id ?? '',
    serviceJourneyId: leg.serviceJourney?.id ?? '',
    mode: 'water',
  }));
}
