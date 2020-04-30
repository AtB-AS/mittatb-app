import axios from 'axios';
import {getCustomerId} from '../utils/customerId';

export const TICKET_SERVICE_BASE_URL =
  'https://atb-ticket-jlmnrncfba-ew.a.run.app';

let client = axios.create({
  baseURL: TICKET_SERVICE_BASE_URL + '/ticket/v1/',
});

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

export async function capture(transaction_id: string) {
  const customer_id = await getCustomerId();

  const url = 'capture';
  await client.put(url, {customer_id, transaction_id});
}

export type FareContract = {
  product_name: string;
  duration: number;
  user_profile: 'adult';
};

export type ListTicketsResponse = {
  fare_contracts: FareContract[];
};

export type ReserveTicketResponse = {
  transaction_id: string;
  url: string;
};
