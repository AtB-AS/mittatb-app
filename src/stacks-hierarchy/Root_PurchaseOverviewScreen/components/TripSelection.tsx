import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {View} from 'react-native';
import React, {useState} from 'react';
import {MemoizedResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import type {TripSearchTime} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {useBookingTrips} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/use-booking-trips';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';

type Props = {
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
};

export function TripSelection({selection, setSelection}: Props) {
  const [searchTime] = useState<TripSearchTime>({
    date: new Date().toISOString(),
    option: 'now',
  });
  const {tripPatterns, reload} = useBookingTrips({
    selection,
    enabled: true,
  });
  // Refetch in case the availability has changed
  useDoOnceWhen(reload, true, true);

  const selectionBuilder = usePurchaseSelectionBuilder();

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      {tripPatterns.map((tp, i) => (
        <PressableOpacity
          onPress={() =>
            setSelection(
              selectionBuilder
                .fromSelection(selection)
                .legs(mapToSalesTripPatternLegs(tp.legs))
                .build(),
            )
          }
        >
          <ThemeText>{new Date(tp.expectedStartTime).toDateString()}</ThemeText>
          <ThemeText>{tp.booking.availability}</ThemeText>
          <MemoizedResultItem
            tripPattern={tp}
            searchTime={searchTime}
            key={i}
          />
        </PressableOpacity>
      ))}
    </View>
  );
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
