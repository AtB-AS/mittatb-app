import {getCustomerId} from '../utils/customerId';
import {createClient} from './client';

export const TICKET_SERVICE_BASE_URL = 'https://atb-ticket.dev.mittatb.no';

const client = createClient(TICKET_SERVICE_BASE_URL + '/ticket/v1/');

export async function list(): Promise<ListTicketsResponse> {
  const customerId = await getCustomerId();

  const url = 'ticket/' + customerId;
  const response = await client.get<ListTicketsResponse>(url);

  return response.data;
}

export async function search(
  zones: string[],
  userTypes: {id: string; user_type: UserType}[],
  products: string[],
): Promise<Offer[]> {
  const body = {
    zones,
    travellers: userTypes.map(({id, user_type}) => ({
      id,
      user_type,
      count: 1,
    })),
    products,
  };

  const url = 'search';
  const response = await client.post<Offer[]>(url, body);

  return response.data;
}

interface SendReceiptResponse {
  reference: string;
}

export async function sendReceipt(fc: FareContract, email: string) {
  const url = 'receipt';
  const response = await client.post<SendReceiptResponse>(url, {
    order_id: fc.order_id,
    order_version: parseInt(fc.order_version, 10),
    email_address: email,
  });

  return response.data;
}

export async function reserve(offers: ReserveOffer[]) {
  const customer_id = await getCustomerId();

  const url = 'reserve';
  const response = await client.post<ReserveTicketResponse>(url, {
    payment_type: 1,
    customer_id,
    offers,
  });

  return response.data;
}

export async function capture(payment_id: number, transaction_id: number) {
  const url = 'capture';
  await client.put(url, {payment_id, transaction_id});
}

export type UserType = 'ADULT';

export type OfferPrice = {
  amount: string | null;
  amount_float: number | null;
  currency: string;
  vat_group?: string;
  tax_amount?: string;
};

export type Offer = {
  offer_id: string;
  traveller_id: string;
  prices: OfferPrice[];
};

export type OfferSearchResponse = Offer[];

export type FareContract = {
  order_id: string;
  order_version: string;
  product_name: string;
  duration: number;
  usage_valid_from: number;
  usage_valid_to: number;
  user_profile: string;
};

export type ListTicketsResponse = {
  fare_contracts: FareContract[];
};

export type ReserveOffer = {
  offer_id: string;
  count: number;
};

export type ReserveTicketResponse = {
  payment_id: number;
  transaction_id: number;
  url: string;
};
