import {client} from '../../api';
import {Offer} from '@atb/ticketing';
import {TicketAssistantData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';

export async function getRecommendedTicket(
  body: TicketAssistantData,
): Promise<Offer[]> {
  const url = 'ticket/v3/assistant';
  try {
    const response = await client.post<Offer[]>(url, body);
    console.log('getRecommendedTicket', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
