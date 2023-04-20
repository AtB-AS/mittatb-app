import {TicketResponseData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

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
  return Math.ceil((duration / 7) * frequency);
}

export function getIndexOfLongestDurationTicket(
  tickets: TicketResponseData[],
): number {
  try {
    let longestDuration = 0;
    let longestDurationIndex = 0;
    tickets.forEach((ticket, index) => {
      if (ticket.duration > longestDuration) {
        longestDuration = ticket.duration;
        longestDurationIndex = index;
      }
    });
    return longestDurationIndex;
  } catch (e) {
    console.log('Error getting index of longest duration ticket ' + e);
    return 0;
  }
}

export function perTripSavings(
  savings: number,
  duration: number,
  frequency: number,
): string {
  return (savings / ((duration / 7) * frequency)).toFixed(2);
}
