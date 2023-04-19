// Functions to calculate days between two dates
import {addDays} from 'date-fns';
import {dateToDateString} from '@atb/components/sections/items/date-input/utils';

export function dateDiffInDays(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  let _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Function for getting days weeks or months from days
export function getDaysWeeksMonths(days: number) {
  if (days < 7) {
    return days;
  } else if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 0 ? weeks + 1 : weeks;
  } else {
    const months = Math.round(days / 30);
    return months === 0 ? months + 1 : months;
  }
}

// Function for getting index on slider from days
export function getSliderIndex(days: number, durations: number[]) {
  let closestIndex = 0;
  let minDifference = Math.abs(days - durations[0]);

  for (let i = 1; i < durations.length; i++) {
    let difference = Math.abs(days - durations[i]);
    if (difference < minDifference) {
      closestIndex = i;
      minDifference = difference;
    }
  }

  return closestIndex;
}

// Functions for getting the date from the slider
export function getDateFromSlider(days: number) {
  // Current date + days from slider
  const date = addDays(new Date(), days);
  return dateToDateString(date);
}
