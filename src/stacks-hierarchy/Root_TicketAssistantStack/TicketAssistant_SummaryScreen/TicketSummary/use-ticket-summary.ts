import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {
  calculateSavings,
  calculateSingleTickets,
  getIndexOfLongestDurationTicket,
  perTripSavings,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';

export const useTicketSummary = () => {
  const {t, language} = useTranslation();
  const {response, purchaseDetails, data} = useTicketAssistantState();
  const {tickets, zones, total_cost, single_ticket_price} = response;
  const {duration, frequency} = data;
  const index = getIndexOfLongestDurationTicket(tickets);
  const ticket = tickets[index];
  const recommendedTicketTypeConfig =
    purchaseDetails?.purchaseTicketDetails[index]?.fareProductTypeConfig;
  const preassignedFareProduct =
    purchaseDetails?.purchaseTicketDetails[index]?.preassignedFareProduct;
  const traveller = purchaseDetails?.userProfileWithCount[0];

  const ticketName =
    getReferenceDataName(preassignedFareProduct, language) ?? '';
  const travellerName = getReferenceDataName(traveller, language);
  const [fromTariffZone, toTariffZone] = purchaseDetails?.tariffZones ?? [];

  const zonesString = `${fromTariffZone.name?.value}${
    zones[0] !== zones[1] ? ` - ${toTariffZone.name?.value}` : ''
  }`;

  const savings = calculateSavings(
    total_cost,
    calculateSingleTickets(duration, frequency) * single_ticket_price,
  );

  const ticketPriceString = `${ticket.price.toFixed(2)}kr`;
  const perTripPriceString = `${(ticket.duration
    ? ticket.price / ((ticket.duration / 7) * frequency)
    : ticket.price
  ).toFixed(2)}kr`;

  const transportModes = recommendedTicketTypeConfig.transportModes;
  const savingsText = t(
    duration !== undefined
      ? TicketAssistantTexts.summary.savings({
          totalSavings: savings,
          perTripSavings: perTripSavings(savings, duration, frequency),
          alternative: `${calculateSingleTickets(duration, frequency)}`,
        })
      : TicketAssistantTexts.summary.noticeLabel2,
  );

  const a11ySummary = t(
    TicketAssistantTexts.summary.ticketSummaryA11yLabel({
      ticket: ticketName,
      traveller: travellerName,
      tariffZones: zonesString,
      price: ticketPriceString,
      pricePerTrip: perTripPriceString,
    }),
  );

  return {
    ticketName,
    travellerName,
    zonesString,
    ticketPriceString,
    perTripPriceString,
    savings,
    ticketDuration: ticket.duration,
    transportModes,
    savingsText,
    a11ySummary,
  };
};
