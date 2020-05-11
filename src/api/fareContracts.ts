import axios from 'axios';
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

export async function reserve() {
  const customer_id = await getCustomerId();

  const url = 'reserve';
  const response = await client.post<ReserveTicketResponse>(url, {customer_id});

  return response.data;
}

export async function capture(payment_id: number, transaction_id: number) {
  const url = 'capture';
  await client.put(url, {payment_id, transaction_id});
}

export type FareContract = {
  product_name: string;
  duration: number;
  usage_valid_from: number;
  usage_valid_to: number;
  user_profile: string;
};

export type ListTicketsResponse = {
  fare_contracts: FareContract[];
};

export type ReserveTicketResponse = {
  payment_id: number;
  transaction_id: number;
  url: string;
};
