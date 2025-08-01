import {GenericSectionItem} from '@atb/components/sections';
import React, {useState} from 'react';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import type {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {FullScreenView} from '@atb/components/screen-view';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {BookingTripSelection} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/components/TripSelection';
import {
  DateSelection,
  DepartureSearchTime,
} from '@atb/components/date-selection';
import {ScreenHeading} from '@atb/components/heading';
import TripSelectionTexts from '@atb/translations/screens/TripSelectionScreen';
import {type TranslateFunction, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import type {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';

type Props = RootStackScreenProps<'Root_TripSelectionScreen'>;

export const Root_TripSelectionScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const [selection, setSelection] = useParamAsState(params.selection);
  const [searchTime, setSearchTime] = useState<DepartureSearchTime>(
    selection.travelDate
      ? {
          date: selection.travelDate,
          option: 'departure',
        }
      : {
          date: new Date().toISOString(),
          option: 'now',
        },
  );
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const builder = usePurchaseSelectionBuilder();

  const screenHeaderTitle =
    selection.stopPlaces?.from && selection.stopPlaces?.to
      ? `${selection.stopPlaces.from.name} - ${selection.stopPlaces.to.name}`
      : undefined;

  return (
    <FullScreenView
      headerProps={{
        title: t(TripSelectionTexts.header),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={
        screenHeaderTitle
          ? (focusRef) => (
              <ScreenHeading ref={focusRef} text={screenHeaderTitle} />
            )
          : undefined
      }
    >
      <View style={styles.header}>
        <DateSelection
          searchTime={searchTime}
          setSearchTime={(searchTime) => {
            setSearchTime(searchTime);
            setSelection((prev) => ({
              ...prev,
              travelDate: searchTime.date,
            }));
          }}
          backgroundColor={theme.color.background.neutral[1]}
        />
      </View>
      <GenericSectionItem style={styles.content}>
        <BookingTripSelection
          selection={selection}
          onSelect={(legs) => {
            const newSelection = builder
              .fromSelection(selection)
              .legs(mapToSalesTripPatternLegs(t, legs))
              .build();
            setSelection(newSelection);

            if (selection.isOnBehalfOf) {
              navigation.navigate('Root_ChooseTicketRecipientScreen', {
                selection: newSelection,
                mode: params.mode,
              });
            } else {
              navigation.navigate({
                name: 'Root_PurchaseConfirmationScreen',
                params: {
                  mode: params.mode,
                  selection: newSelection,
                },
                merge: true,
              });
            }
          }}
        />
      </GenericSectionItem>
    </FullScreenView>
  );
};

export function mapToSalesTripPatternLegs(
  t: TranslateFunction,
  legs: TripPatternFragment['legs'],
) {
  return legs.map((l) => ({
    fromStopPlaceId: l.fromPlace.quay?.stopPlace?.id ?? '',
    fromStopPlaceName: l.fromPlace.quay?.stopPlace?.name ?? '',
    toStopPlaceId: l.toPlace.quay?.stopPlace?.id ?? '',
    toStopPlaceName: l.toPlace.quay?.stopPlace?.name ?? '',
    expectedStartTime: l.expectedStartTime,
    expectedEndTime: l.expectedEndTime,
    mode: l.mode,
    subMode: l.transportSubmode,
    serviceJourneyId: l.serviceJourney?.id ?? '',
    lineNumber: l.line?.publicCode ?? '',
    lineName: formatDestinationDisplay(
      t,
      l.fromEstimatedCall?.destinationDisplay,
    ),
  }));
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    marginTop: theme.spacing.medium,
  },
  content: {
    backgroundColor: theme.color.background.neutral[1].background,
    borderWidth: 0,
  },
}));
