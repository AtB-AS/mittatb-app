import {GlobalMessageType} from '@atb/global-messages/types';

export const isWithinTimeRange = (
  globalMessage: GlobalMessageType,
  now: number,
) => {
  const startDate = globalMessage.startDate ?? 0;
  const endDate = globalMessage.endDate ?? 8640000000000000;

  return startDate <= now && endDate >= now;
};
