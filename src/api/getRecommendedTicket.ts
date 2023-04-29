import {client} from '@atb/api';
import {
  RecommendedTicketResponse,
  InputParams,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

export async function getRecommendedTicket(
  inputParams: InputParams,
  preassignedFareProductIds: string[],
): Promise<RecommendedTicketResponse> {
  const url = 'ticket/v3/assistant';
  const body = {
    ...inputParams,
    preassigned_fare_products: preassignedFareProductIds,
  };
  try {
    const response = await client.post<RecommendedTicketResponse>(url, body);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
