// hooks/useTicketSummary.ts
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {
  calculateSavings,
  calculateSingleTickets,
  getIndexOfLongestDurationTicket,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {useTextForLanguage} from '@atb/translations/utils';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useTranslation} from '@atb/translations';

export const useTicketSummary = () => {
  const {language} = useTranslation();
  const {response, purchaseDetails, data} = useTicketAssistantState();
  const {tickets, zones, total_cost, single_ticket_price} = response;
  const {duration, frequency} = data;

  const index = getIndexOfLongestDurationTicket(tickets);
  const ticket = tickets[index];
  const ticketDuration = ticket.duration;

  const recommendedTicketTypeConfig =
    purchaseDetails?.purchaseTicketDetails[index]?.fareProductTypeConfig;

  const traveller = purchaseDetails?.userProfileWithCount[0];

  const ticketName = useTextForLanguage(recommendedTicketTypeConfig.name) ?? '';
  const travellerName = getReferenceDataName(traveller, language);
  const [fromTariffZone, toTariffZone] = purchaseDetails?.tariffZones ?? [];

  const zonesString = `${fromTariffZone.name?.value}${
    zones[0] !== zones[1] ? ` - ${toTariffZone.name?.value}` : ''
  }`;

  const savings = calculateSavings(
    total_cost,
    calculateSingleTickets(duration, frequency) * single_ticket_price,
  );

  const ticketPriceString = ticket.price.toFixed(2) + 'kr';
  const perTripPriceString =
    (ticket.duration
      ? ticket.price
      : ticket.price / ((ticket.duration / 7) * frequency)
    ).toFixed(2) + 'kr';

  const transportModes = recommendedTicketTypeConfig.transportModes;

  return {
    ticketName,
    travellerName,
    zonesString,
    ticketPriceString,
    perTripPriceString,
    savings,
    ticketDuration,
    transportModes,
  };
};
