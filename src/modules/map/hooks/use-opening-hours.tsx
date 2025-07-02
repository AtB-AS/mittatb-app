import {useNow} from '@atb/utils/use-now';
import opening_hours from 'opening_hours';

type OpeningHoursType = {
  isOpen: boolean | null;
  openingTime: Date | null;
  closingTime: Date | null;
};

export const useOpeningHours = (
  openingHours: string | undefined,
): OpeningHoursType => {
  const now = useNow(30000);
  if (!openingHours) {
    return {isOpen: null, openingTime: null, closingTime: null};
  }

  const dateNow = new Date(now);
  const oh = new opening_hours(openingHours ?? '');

  const isOpen = oh && oh?.getState(dateNow);

  const today = new Date(dateNow);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const openIntervalsToday = oh?.getOpenIntervals(today, tomorrow);

  if (
    !openIntervalsToday ||
    openIntervalsToday.length === 0 ||
    !openIntervalsToday[0]?.[0] ||
    !openIntervalsToday[0]?.[1]
  ) {
    return {isOpen: null, openingTime: null, closingTime: null};
  }

  return {
    isOpen,
    openingTime: openIntervalsToday[0][0],
    closingTime: openIntervalsToday[0][1],
  };
};
