import {TicketResponseData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {daysInWeek} from 'date-fns';

export function calculateSavings(
  ticketPrice: number,
  alternativePrice: number,
): number {
  return alternativePrice - ticketPrice;
}

export function calculateSingleTickets(
  duration: number,
  frequency: number,
): number {
  return Math.ceil((duration / daysInWeek) * frequency);
}

export function getLongestDurationTicket(
  tickets: TicketResponseData[],
): TicketResponseData {
  let longestDuration = 0;
  let longestDurationIndex = 0;
  tickets.forEach((ticket, index) => {
    if (ticket.duration > longestDuration) {
      longestDuration = ticket.duration;
      longestDurationIndex = index;
    }
  });
  return tickets[longestDurationIndex];
}

export function perTripSavings(
  savings: number,
  duration: number,
  frequency: number,
): number {
  return savings / ((duration / daysInWeek) * frequency);
}
