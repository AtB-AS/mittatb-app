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
    traveller: {
      id: inputParams.traveller?.id,
      user_type: inputParams.traveller?.userType,
    },
    preassigned_fare_products: preassignedFareProductIds,
  };
  try {
    const response = await client.post<RecommendedTicketResponseRaw>(url, body);
    const apiResponse = response.data;
    return {
      totalCost: apiResponse.total_cost,
      tickets: apiResponse.tickets.map((ticket) => ({
        ...ticket,
        productId: ticket.product_id,
        fareProduct: ticket.fare_product,
        traveller: {
          id: ticket.traveller.id,
          userType: ticket.traveller.user_type,
        },
      })),
      zones: apiResponse.zones,
      singleTicketPrice: apiResponse.single_ticket_price,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}
type RecommendedTicketResponseRaw = {
  total_cost: number;
  tickets: [
    {
      product_id: string;
      fare_product: string;
      duration: number;
      quantity: number;
      price: number;
      traveller: {id: string; user_type: string};
    },
  ];
  zones: string[];
  single_ticket_price: number;
};
