import {AccessibleText, ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {
  daysBetween,
  formatToClock,
  formatToSimpleDate,
  isInThePast,
  secondsToDurationShort,
} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';

import React from 'react';
import {View} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {addSeconds, differenceInMinutes} from 'date-fns';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import TravelCardTexts from '@atb/translations/components/TravelCard';

export const TravelCardHeader: React.FC<{
  tripPattern: TripPattern;
  includeDayInfo?: boolean;
}> = ({tripPattern, includeDayInfo = true}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  let start = tripPattern.legs[0];
  let startName = start.fromPlace.name;
  const end = tripPattern.legs[tripPattern.legs.length - 1];
  const endName = end.toPlace.name;
  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    start = tripPattern.legs[1];
    startName = getQuayName(start.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    startName = getQuayName(start.fromPlace.quay);
  }
  const startLegIsFlexibleTransport = isLineFlexibleTransport(start.line);
  const publicCode = start.fromPlace.quay?.publicCode || start.line?.publicCode;

  const durationText = secondsToDurationShort(tripPattern.duration, language);
  const transportName = t(getTranslatedModeName(start.mode));
  const {expectedStartTime, expectedEndTime} = tripPattern;
  const {aimedStartTime, aimedEndTime} = computeAimedStartEndTimes(tripPattern);

  const isInPast = isInThePast(expectedEndTime);

  const expectedTimeLabel = useTimeLabel(
    expectedStartTime,
    expectedEndTime,
    includeDayInfo,
  );

  const aimedTimeLabel = useTimeLabel(
    aimedStartTime,
    aimedEndTime,
    isInPast && includeDayInfo,
  );

  const areTimesEquivalentInMinutes =
    differenceInMinutes(expectedStartTime, aimedStartTime) < 1 &&
    differenceInMinutes(expectedEndTime, aimedEndTime) < 1;

  return (
    <View style={styles.container}>
      <View style={styles.resultHeader}>
        <View style={styles.timeContainer}>
          <ThemeText typography="body__m__strong">
            {isInPast ? t(TravelCardTexts.header.pastTime) : expectedTimeLabel}
          </ThemeText>
          {(!areTimesEquivalentInMinutes || isInPast) && (
            <ThemeText typography="body__s" color="secondary">
              {t(TravelCardTexts.header.originalTime)} {aimedTimeLabel}
            </ThemeText>
          )}
        </View>

        <View style={styles.durationContainer}>
          <AccessibleText
            typography="body__m"
            color="secondary"
            testID="resultDuration"
            prefix={t(TripSearchTexts.results.resultItem.header.totalDuration)}
          >
            {durationText}
          </AccessibleText>
        </View>
      </View>
      <View style={styles.startEndContainer}>
        <ThemeText typography="body__m">
          {startName
            ? startName
            : startLegIsFlexibleTransport && publicCode
              ? t(
                  TripSearchTexts.results.resultItem.header.flexTransportTitle(
                    publicCode,
                  ),
                )
              : transportName}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} />
        <ThemeText typography="body__m">{endName}</ThemeText>
      </View>
    </View>
  );
};

/**
 * Returns the time label for the expected start and end times. If the start time is today, the day information is not included.
 */
function useTimeLabel(
  expectedStartTime: Date,
  expectedEndTime: Date,
  includeDayInfo: boolean,
) {
  const {t, language} = useTranslation();
  const numberOfDays = daysBetween(new Date(), expectedStartTime);
  const isToday = numberOfDays === 0;

  let dateLabel = formatToSimpleDate(expectedStartTime, language);

  if (numberOfDays == 1) {
    dateLabel = t(TravelCardTexts.header.day.tomorrow);
  }
  if (numberOfDays == 2) {
    dateLabel = t(TravelCardTexts.header.day.dayAfterTomorrow);
  }

  // Format: [date (if not today)], [start time rounded down]  - [end time rounded up]
  return `${includeDayInfo && !isToday ? dateLabel + ', ' : ''}${formatToClock(expectedStartTime, language, 'floor')} - ${formatToClock(expectedEndTime, language, 'ceil')}`;
}

/**
 * The trip patterns returned by Entur has an issue:
 * For foot legs (or legs without a quay), the aimed start and end times are always the same as the expected start and end times.
 * In other words, you have no way of knowing the "original" (aimed) start and end times for a complete trip pattern if the
 * first and last legs are not "quay" legs.
 *
 * If that is the case, this function computes the aimed start and end times by:
 * - Subtracting the duration of the legs up to the first leg with a quay
 * - Adding the duration of the legs after the last leg with a quay
 *
 * Otherwise, it returns the aimed start and end times from the first and last legs.
 *
 * @param tripPattern - The trip pattern to get the aimed start and end times for.
 * @returns The computed aimed start and end times.
 */
const computeAimedStartEndTimes = (tripPattern: TripPattern) => {
  const firstLeg = tripPattern.legs[0];
  const lastLeg = tripPattern.legs[tripPattern.legs.length - 1];

  let aimedStartTime = firstLeg.aimedStartTime;
  let aimedEndTime = lastLeg.aimedEndTime;

  // Could there be other cases than foot legs where we have no aimed start/end times?
  if (tripPattern.legs.some((leg) => leg.mode === 'foot')) {
    if (!hasQuay(firstLeg)) {
      // Find the first leg with a quay
      const firstLegWithQuayIndex = tripPattern.legs.findIndex(hasQuay);
      if (firstLegWithQuayIndex) {
        const firstLegWithQuay = tripPattern.legs[firstLegWithQuayIndex];
        // Compute the duration up to the first leg with a quay
        const durationUpTillQuay = tripPattern.legs
          .slice(0, firstLegWithQuayIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        // Subtract the duration from the aimed start time of the first leg with a quay
        // to get the actual aimed start time of the first leg
        aimedStartTime = addSeconds(
          firstLegWithQuay.aimedStartTime,
          -durationUpTillQuay,
        );
      }
    }

    if (!hasQuay(lastLeg)) {
      const reversedLegs = [...tripPattern.legs].reverse();
      // Find the last leg with a quay
      const lastLegWithQuayIndex = reversedLegs.findIndex(hasQuay);
      if (lastLegWithQuayIndex) {
        const lastLegWithQuay = reversedLegs[lastLegWithQuayIndex];
        // Compute the duration after the last leg with a quay
        const durationAfterQuay = reversedLegs
          .slice(0, lastLegWithQuayIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        // Add the duration after the last leg with a quay to get
        // the actual aimed end time of the last leg
        aimedEndTime = addSeconds(
          lastLegWithQuay.aimedEndTime,
          durationAfterQuay,
        );
      }
    }
  }
  return {aimedStartTime, aimedEndTime};
};

const hasQuay = (leg: Leg) => {
  return !!leg.fromPlace.quay;
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.small,
  },
  timeContainer: {flex: 1, flexShrink: 1, gap: theme.spacing.xSmall},
  resultHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  durationContainer: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  startEndContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    alignItems: 'center',
  },
  warningIcon: {
    marginLeft: theme.spacing.small,
  },
}));
