import {GenericSectionItem} from '@atb/components/sections';
import React, {useState} from 'react';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import type {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {FullScreenView} from '@atb/components/screen-view';
import {useThemeContext} from '@atb/theme';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import type {SalesTripPatternLeg} from '@atb/api/types/sales';
import {Button} from '@atb/components/button';
import {useTripsWithAvailability} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/use-trips-with-availability';
import {TripSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/TripSelection';
import {
  DateSelection,
  DepartureSearchTime,
} from '@atb/components/date-selection';

type Props = RootStackScreenProps<'Root_TripSelectionScreen'>;

type TripPatternFragmentWithAvailability = TripPatternFragment & {
  available: number | undefined;
};

export const Root_TripSelectionScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const [selection, setSelection] = useParamAsState(params.selection);
  const [selected, setSelected] =
    useState<TripPatternFragmentWithAvailability>();
  const [searchTime, setSearchTime] = useState<DepartureSearchTime>({
    date: new Date().toISOString(),
    option: 'now',
  });
  const {theme} = useThemeContext();

  const selectionBuilder = usePurchaseSelectionBuilder();
  const {tripPatterns} = useTripsWithAvailability({
    selection,
    searchTime,
  });

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
        <TripSelection selection={selection} setSelection={setSelection} />
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
