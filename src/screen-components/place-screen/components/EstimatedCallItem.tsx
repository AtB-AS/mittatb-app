import {EstimatedCall} from '@atb/api/types/departures';
import {screenReaderPause} from '@atb/components/text';
import {StoredFavoriteDeparture} from '@atb/modules/favorites';
import {Statuses, StyleSheet} from '@atb/theme';
import {
  bookingStatusToMsgType,
  getBookingStatus,
  getLineA11yLabel,
  getNoticesForEstimatedCall,
} from '@atb/screen-components/travel-details-screens';
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
import React, {memo, type RefObject, useRef} from 'react';
import {View} from 'react-native';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {isDefined} from '@atb/utils/presence';
import {
  getMsgTypeForMostCriticalSituationOrNotice,
  toMostCriticalStatus,
} from '@atb/modules/situations';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {DepartureTime, EstimatedCallInfo} from '@atb/components/estimated-call';

export type EstimatedCallItemProps = {
  secondsUntilDeparture: number;
  departure: EstimatedCall;
  existingFavorite?: StoredFavoriteDeparture;
  onPressDetails: (departure: EstimatedCall) => void;
  showBottomBorder: boolean;
  testID?: string;
};

export const EstimatedCallItem = memo(
  ({
    departure,
    onPressDetails,
    showBottomBorder,
  }: EstimatedCallItemProps): React.JSX.Element => {
    const styles = useStyles();
    const {t, language} = useTranslation();
    const testID = 'estimatedCallItem';
    const onCloseRef = useRef<RefObject<any>>(null);

    return (
      <GenericClickableSectionItem
        radius={showBottomBorder ? 'bottom' : undefined}
        onPress={() => onPressDetails(departure)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={getLineAndTimeA11yLabel(departure, t, language)}
        accessibilityHint={t(DeparturesTexts.a11yViewDepartureDetailsHint)}
        importantForAccessibility="yes"
        ref={onCloseRef}
      >
        <View style={styles.container} testID={testID}>
          <EstimatedCallInfo
            departure={departure}
            messageType={getMsgTypeForEstimatedCall(departure)}
            testID={testID}
          />
          <DepartureTime departure={departure} />
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
