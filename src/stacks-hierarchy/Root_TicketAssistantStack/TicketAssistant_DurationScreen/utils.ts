import {TicketAssistantTexts, TranslateFunction} from '@atb/translations';
import {daysInWeek} from '@atb/utils/date';
import {ONE_DAY_MS} from '@atb/utils/durations.ts';

export function dateDiffInDays(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / ONE_DAY_MS);
}

// Function for getting days weeks or months from days
export function getDurationText(days: number, t: TranslateFunction): string {
  if (days < daysInWeek) {
    return t(TicketAssistantTexts.duration.resultDays({value: days}));
  } else if (days < 30) {
    const weeks = Math.round(days / daysInWeek);
    const formattedWeeks = weeks === 0 ? weeks + 1 : weeks;
    return t(
      TicketAssistantTexts.duration.resultWeeks({
        value: formattedWeeks,
      }),
    );
  } else if (days < 180) {
    const months = Math.round(days / 30);
    const formattedMonths = months === 0 ? months + 1 : months;
    return t(
      TicketAssistantTexts.duration.resultMonths({
        value: formattedMonths,
      }),
    );
  } else {
    return t(TicketAssistantTexts.duration.resultMoreThan180Days);
  }
}

// Function for getting index on slider from days
export function getSliderIndex(days: number, durations: number[]) {
  let closestIndex = 0;
  let minDifference = Math.abs(days - durations[0]);

  for (let i = 1; i < durations.length; i++) {
    const difference = Math.abs(days - durations[i]);
    if (difference < minDifference) {
      closestIndex = i;
      minDifference = difference;
    }
  }

  return closestIndex;
}
