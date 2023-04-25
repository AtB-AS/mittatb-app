import {client} from '@atb/api/index';
import {
  RecommendedTicketResponse,
  TicketAssistantData,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

export async function getRecommendedTicket(
  body: TicketAssistantData,
): Promise<RecommendedTicketResponse> {
  const url = 'ticket/v3/assistant';
  try {
    const response = await client.post<RecommendedTicketResponse>(url, body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
