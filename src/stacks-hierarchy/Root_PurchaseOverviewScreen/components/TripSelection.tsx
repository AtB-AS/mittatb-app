import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';
import {View} from 'react-native';
import React, {useState} from 'react';
import {MemoizedResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import type {TripSearchTime} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {
  mapToSalesTripPatternLegs,
  useTripsWithAvailability,
} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/use-trips-with-availability';

type Props = {
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
};

export function TripSelection({selection, setSelection}: Props) {
  const [searchTime] = useState<TripSearchTime>({
    date: new Date().toISOString(),
    option: 'now',
  });
  const {tripPatterns} = useTripsWithAvailability({
    selection,
    searchTime,
    enabled: true,
  });
  const selectionBuilder = usePurchaseSelectionBuilder();
  return (
    <View
      style={{
        width: '100%',
      }}
    >
      {tripPatterns.map((tp, i) => (
        <MemoizedResultItem
          tripPattern={tp}
          onDetailsPressed={() =>
            setSelection(
              selectionBuilder
                .fromSelection(selection)
                .legs(mapToSalesTripPatternLegs(tp.legs))
                .build(),
            )
          }
          resultIndex={i}
          searchTime={searchTime}
          key={i}
        />
      ))}
    </View>
  );
}
