import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import type {TripPattern} from '@atb/api/types/trips';
import type {TripSearchTime} from '../../types';
import {MemoizedResultItem} from './ResultItem';
import {MemoizedResultItemFooter} from './ResultRowFooter';
import {
  dictionary,
  Language,
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {formatToClock, isInThePast, secondsToDuration} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {screenReaderPause} from '@atb/components/text';
import {
  getFilteredLegsByWalkOrWaitTime,
  getTripPatternBookingStatus,
  isLineFlexibleTransport,
} from '@atb/screen-components/travel-details-screens';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {getTripPatternBookingText, isSignificantDifference} from '../utils';

type ResultRowProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  resultIndex: number;
  searchTime: TripSearchTime;
  testID?: string;
};

export const ResultRow: React.FC<ResultRowProps> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  searchTime,
  testID,
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();

  const resultNumber = resultIndex + 1;
  const isInPast =
    isInThePast(tripPattern.legs[0].expectedStartTime) &&
    searchTime?.option !== 'now';

  return (
    <PressableOpacity
      accessibilityLabel={tripSummary(
        tripPattern,
        t,
        language,
        isInPast,
        resultNumber,
      )}
      accessibilityHint={t(
        TripSearchTexts.results.resultItem.footer.detailsHint,
      )}
      accessibilityRole="button"
      style={styles.pressableOpacity}
      onPress={() => onDetailsPressed(tripPattern, resultIndex)}
      accessible={true}
      testID={testID}
    >
      <View style={[styles.resultRow, isInPast && styles.resultInPast]}>
        <MemoizedResultItem
          tripPattern={tripPattern}
          state={isInPast ? 'dimmed' : 'enabled'}
        />
        <MemoizedResultItemFooter
          tripPattern={tripPattern}
          isInPast={isInPast}
        />
      </View>
    </PressableOpacity>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  pressableOpacity: {
    marginTop: theme.spacing.small,
  },
  resultRow: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
    rowGap: theme.spacing.small,
    marginTop: theme.spacing.small,
    paddingTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  resultInPast: {
    backgroundColor: theme.color.background.neutral[2].background,
  },
}));

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
  listPosition: number,
) => {
  const distance = Math.round(tripPattern.legs[0].distance);
  let humanizedDistance;
  if (distance >= 1000) {
    humanizedDistance = `${distance / 1000} ${t(dictionary.distance.km)}`;
  } else {
    humanizedDistance = `${distance} ${t(dictionary.distance.m)}`;
  }

  let startText = '';

  if (tripPattern.legs[0]?.mode === 'foot' && tripPattern.legs[1]) {
    const quayName = getQuayName(tripPattern.legs[1]?.fromPlace.quay);

    {
      quayName
        ? (startText = t(
            TripSearchTexts.results.resultItem.footLeg.walkToStopLabel(
              humanizedDistance,
              quayName,
            ),
          ))
        : undefined;
    }
  } else {
    const quayName = getQuayName(tripPattern.legs[0]?.fromPlace.quay);
    if (quayName) {
      startText = t(
        TripSearchTexts.results.resultItem.header.title(
          t(getTranslatedModeName(tripPattern.legs[0].mode)),
          quayName,
        ),
      );
    }
  }

  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const firstLeg = nonFootLegs.length > 0 ? nonFootLegs[0] : undefined;

  const resultNumberText =
    t(
      TripSearchTexts.results.resultItem.journeySummary.resultNumber(
        listPosition,
      ),
    ) + screenReaderPause;
  const passedTripText = isInPast
    ? t(TripSearchTexts.results.resultItem.passedTrip) + ', '
    : undefined;

  const modeAndNumberText = firstLeg
    ? t(getTranslatedModeName(firstLeg.mode)) +
      (firstLeg.line?.publicCode
        ? t(
            TripSearchTexts.results.resultItem.journeySummary.prefixedLineNumber(
              firstLeg.line.publicCode,
            ),
          )
        : '')
    : undefined;

  const realTimeText = firstLeg
    ? isSignificantDifference(firstLeg)
      ? t(
          TripSearchTexts.results.resultItem.journeySummary.realtime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
            formatToClock(firstLeg.aimedStartTime, language, 'floor'),
          ),
        )
      : (isLineFlexibleTransport(firstLeg.line)
          ? t(dictionary.missingRealTimePrefix)
          : '') +
        t(
          TripSearchTexts.results.resultItem.journeySummary.noRealTime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
          ),
        )
    : undefined;

  const numberOfFootLegsText = !nonFootLegs.length
    ? t(
        TripSearchTexts.results.resultItem.journeySummary.legsDescription
          .footLegsOnly,
      )
    : nonFootLegs.length === 1
    ? t(
        TripSearchTexts.results.resultItem.journeySummary.legsDescription
          .noSwitching,
      )
    : nonFootLegs.length === 2
    ? t(
        TripSearchTexts.results.resultItem.journeySummary.legsDescription
          .oneSwitch,
      )
    : t(
        TripSearchTexts.results.resultItem.journeySummary.legsDescription.someSwitches(
          nonFootLegs.length - 1,
        ),
      );

  const walkDistance = tripPattern.legs
    .filter((l) => l.mode === Mode.Foot)
    .reduce((tot, {distance}) => tot + distance, 0);
  const walkDistanceText = t(
    TripSearchTexts.results.resultItem.journeySummary.totalWalkDistance(
      walkDistance.toFixed(),
    ),
  );

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const startTimeIsApproximation =
    filteredLegs.length > 0 && isLineFlexibleTransport(filteredLegs[0].line);
  const endTimeIsApproximation =
    filteredLegs.length > 0 &&
    isLineFlexibleTransport(filteredLegs[filteredLegs.length - 1].line);

  const traveltimesText = t(
    TripSearchTexts.results.resultItem.journeySummary.travelTimes(
      formatToClock(tripPattern.expectedStartTime, language, 'floor'),
      formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
      secondsToDuration(tripPattern.duration, language),
      startTimeIsApproximation,
      endTimeIsApproximation,
    ),
  );

  const tripPatternBookingStatus = getTripPatternBookingStatus(tripPattern);
  const bookingText = getTripPatternBookingText(tripPatternBookingStatus, t);

  const texts = [
    resultNumberText,
    bookingText,
    passedTripText,
    startText,
    modeAndNumberText,
    realTimeText,
    numberOfFootLegsText,
    walkDistanceText,
    traveltimesText,
  ].filter((text) => text !== undefined);

  return texts.join(screenReaderPause);
};
