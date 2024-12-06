import {EstimatedCall} from '@atb/api/types/departures';
import {screenReaderPause} from '@atb/components/text';
import {
  FavouriteDepartureToggle,
  StoredFavoriteDeparture,
} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
import {
  getNoticesForEstimatedCall,
  bookingStatusToMsgType,
  getBookingStatus,
  getLineA11yLabel,
} from '@atb/travel-details-screens/utils';
import {destinationDisplaysAreEqual} from '@atb/utils/destination-displays-are-equal';
import {
  CancelledDepartureTexts,
  DeparturesTexts,
  dictionary,
  Language,
  SituationsTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  formatLocaleTime,
  formatToClockOrLongRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';
import React, {memo} from 'react';
import {View} from 'react-native';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {isDefined} from '@atb/utils/presence';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {
  getMsgTypeForMostCriticalSituationOrNotice,
  toMostCriticalStatus,
} from '@atb/situations/utils';
import {Statuses} from '@atb/theme';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {EstimatedCallInfo} from '@atb/components/estimated-call';
import {DepartureTime} from '@atb/components/estimated-call';

export type EstimatedCallItemProps = {
  secondsUntilDeparture: number;
  mode: StopPlacesMode;
  departure: EstimatedCall;
  existingFavorite?: StoredFavoriteDeparture;
  onPressDetails: (departure: EstimatedCall) => void;
  onPressFavorite: (
    departure: EstimatedCall,
    existingFavorite?: StoredFavoriteDeparture,
  ) => void;
  showBottomBorder: boolean;
  testID?: string;
};

export const EstimatedCallItem = memo(
  ({
    departure,
    mode,
    onPressDetails,
    onPressFavorite,
    existingFavorite,
    showBottomBorder,
  }: EstimatedCallItemProps): JSX.Element => {
    const styles = useStyles();
    const {t, language} = useTranslation();
    const testID = 'estimatedCallItem';

    const onPress =
      mode === 'Favourite'
        ? () => onPressFavorite(departure, existingFavorite)
        : () => onPressDetails(departure);

    const a11yLabel =
      mode === 'Favourite'
        ? getLineA11yLabel(
            departure.destinationDisplay,
            departure.serviceJourney.line.publicCode,
            t,
          )
        : getLineAndTimeA11yLabel(departure, t, language);

    const a11yHint =
      mode === 'Favourite'
        ? t(DeparturesTexts.a11yMarkFavouriteHint)
        : t(DeparturesTexts.a11yViewDepartureDetailsHint);

    const msgType = getMsgTypeForEstimatedCall(departure);

    return (
      <GenericClickableSectionItem
        radius={showBottomBorder ? 'bottom' : undefined}
        onPress={onPress}
        accessible={false}
      >
        <View style={styles.container} testID={testID}>
          <View
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={a11yLabel}
            accessibilityHint={a11yHint}
            style={styles.lineAndDepartureTime}
            importantForAccessibility="yes"
          >
            <EstimatedCallInfo
              departure={departure}
              ignoreSituationsAndCancellations={mode === 'Favourite'}
              messageType={msgType}
              testID={testID}
            />
            {mode !== 'Favourite' && <DepartureTime departure={departure}  />}
          </View>

          {mode !== 'Map' && (
            <FavouriteDepartureToggle
              existingFavorite={existingFavorite}
              onMarkFavourite={() =>
                onPressFavorite(departure, existingFavorite)
              }
            />
          )}
        </View>
      </GenericClickableSectionItem>
    );
  },
  (prev, next) => {
    const prevMinutesUntilDeparture = prev.secondsUntilDeparture % 60;
    const nextMinutesUntilDeparture = next.secondsUntilDeparture % 60;
    if (
      nextMinutesUntilDeparture < 10 &&
      prevMinutesUntilDeparture !== nextMinutesUntilDeparture
    ) {
      // Rerender the item if the relative departure time is changed
      return false;
    }

    if (prev.departure.situations.length !== next.departure.situations.length)
      return false;
    if (prev.existingFavorite?.id !== next.existingFavorite?.id) return false;
    if (prev.showBottomBorder !== next.showBottomBorder) return false;
    if (
      prev.departure.expectedDepartureTime !==
      next.departure.expectedDepartureTime
    )
      return false;
    if (
      destinationDisplaysAreEqual(
        prev.departure.destinationDisplay,
        next.departure.destinationDisplay,
      )
    )
      return false;
    if (prev.departure.realtime !== next.departure.realtime) return false;
    if (prev.departure.cancellation !== next.departure.cancellation)
      return false;
    return true;
  },
);

export function getLineAndTimeA11yLabel(
  departure: EstimatedCall,
  t: TranslateFunction,
  language: Language,
) {
  const msgType = getMsgTypeForEstimatedCall(departure);
  return [
    departure.cancellation ? t(CancelledDepartureTexts.message) : undefined,
    getLineA11yLabel(
      departure.destinationDisplay,
      departure.serviceJourney.line.publicCode,
      t,
    ),
    msgType && t(SituationsTexts.a11yLabel[msgType]),
    departure.realtime
      ? t(dictionary.a11yRealTimePrefix)
      : t(dictionary.a11yRouteTimePrefix),
    formatToClockOrLongRelativeMinutes(
      departure.expectedDepartureTime,
      language,
      t(dictionary.date.units.now),
      9,
    ),
    isMoreThanOneMinuteDelayed(departure)
      ? t(dictionary.a11yRouteTimePrefix) +
        formatLocaleTime(departure.aimedDepartureTime, language)
      : undefined,
  ]
    .filter(isDefined)
    .join(screenReaderPause);
}

const isMoreThanOneMinuteDelayed = (departure: EstimatedCall) =>
  secondsBetween(
    departure.aimedDepartureTime,
    departure.expectedDepartureTime,
  ) >= 60;

export const getMsgTypeForEstimatedCall = (
  estimatedCall: EstimatedCall,
): Exclude<Statuses, 'valid'> | undefined => {
  const msgTypeForSituationOrNotice =
    getMsgTypeForMostCriticalSituationOrNotice(
      estimatedCall.situations,
      getNoticesForEstimatedCall(estimatedCall),
      estimatedCall.cancellation,
    );

  const msgTypeForRailReplacementBus: Statuses | undefined =
    estimatedCall.serviceJourney.transportSubmode ===
    TransportSubmode.RailReplacementBus
      ? 'warning'
      : undefined;

  const bookingStatus = getBookingStatus(
    estimatedCall.bookingArrangements,
    estimatedCall.aimedDepartureTime,
  );
  const msgTypeForBooking = bookingStatusToMsgType(bookingStatus);

  return [
    msgTypeForSituationOrNotice,
    msgTypeForBooking,
    msgTypeForRailReplacementBus,
  ].reduce<Exclude<Statuses, 'valid'> | undefined>(
    toMostCriticalStatus,
    undefined,
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  lineAndDepartureTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
