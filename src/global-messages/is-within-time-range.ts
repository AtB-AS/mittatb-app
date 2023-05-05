import {GlobalMessageType} from '@atb/global-messages/types';

const MAX_DATE_VALUE = 8640000000000000;

export const isWithinTimeRange = (
  globalMessage: GlobalMessageType,
  now: number,
) => {
  const startDate = globalMessage.startDate ?? 0;
  const endDate = globalMessage.endDate ?? MAX_DATE_VALUE;

  return startDate <= now && endDate >= now;
};
