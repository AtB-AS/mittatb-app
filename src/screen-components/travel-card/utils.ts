import {Leg, TripPattern} from '@atb/api/types/trips';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {daysBetween, formatToClock, formatToSimpleDate} from '@atb/utils/date';
import {addSeconds} from 'date-fns';

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
export const computeAimedStartEndTimes = (tripPattern: TripPattern) => {
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

/**
 * Returns the time label for the expected start and end times. If the start time is today, the day information is not included.
 */
export function useTimeLabels(
  startTime: Date,
  endTime: Date,
  includeDayInfo: boolean,
) {
  const {t, language} = useTranslation();
  const numberOfDays = daysBetween(new Date(), startTime);
  const isToday = numberOfDays === 0;

  let dateLabel = formatToSimpleDate(startTime, language);

  if (numberOfDays == 1) {
    dateLabel = t(TravelCardTexts.header.day.tomorrow);
  }
  if (numberOfDays == 2) {
    dateLabel = t(TravelCardTexts.header.day.dayAfterTomorrow);
  }

  const startTimeLabel = formatToClock(startTime, language, 'floor');
  const endTimeLabel = formatToClock(endTime, language, 'ceil');

  return {
    startTimeLabel: `${includeDayInfo && !isToday ? dateLabel + ', ' : ''}${startTimeLabel}`,
    endTimeLabel,
  };
}
