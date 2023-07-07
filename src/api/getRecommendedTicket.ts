import {client} from '@atb/api';

export type Traveller = {
  id: string;
  userType: string;
};

export type InputParams = {
  frequency?: number;
  duration?: number;
  traveller?: Traveller;
  zones?: string[];
};

export type TicketResponseData = {
  productId: string;
  fareProduct: string;
  duration: number;
  quantity: number;
  price: number;
  userProfileId: string;
};

export type RecommendedTicketResponse = {
  totalCost: number;
  tickets: TicketResponseData[];
  zones: string[];
  singleTicketPrice: number;
};

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
        userProfileId: ticket.user_profile_id,
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
      user_profile_id: string;
    },
  ];
  zones: string[];
  single_ticket_price: number;
};
