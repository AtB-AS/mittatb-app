import {TicketResponseData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

export function getLongestDurationTicket(
  tickets: TicketResponseData[],
): TicketResponseData {
  return tickets.reduce((longestTicket, currentTicket) => {
    return currentTicket.duration > longestTicket.duration
      ? currentTicket
      : longestTicket;
  });
}
