import {client} from '../../api';
import {Offer} from '@atb/ticketing';
import {TicketAssistantData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

export async function getRecommendedTicket(
  body: TicketAssistantData,
): Promise<Offer[]> {
  const url = 'ticket/v3/assistant';
  try {
    const response = await client.post<Offer[]>(url, body);
    return response.data;
  } catch (error) {
    return [];
  }
}
