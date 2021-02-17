import {PreactivatedTicket, TravelRight} from './types';

export function isPreactivatedTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedTicket {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket'
  );
}
