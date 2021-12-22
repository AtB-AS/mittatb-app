import {AxiosRequestConfig} from 'axios';
import {ReserveOfferRequestBody} from '.';
import {createClient} from '../api/client';
import {
  Offer,
  PaymentResponse,
  PaymentType,
  RecentFareContract,
  RecurringPayment,
  ReserveOffer,
  SendReceiptResponse,
  TicketReservation,
} from './types';

const client = createClient('http://localhost:8080');
client.defaults.headers = {
  'X-Endpoint-API-UserInfo':
    'eyJhYnRfaWQiOiJBVEI6Q3VzdG9tZXJBY2NvdW50OjduSjlQTHpCTjJQcGxhYlgzdUJCczV6cmtubDIiLCJjdXN0b21lcl9udW1iZXIiOjM1Nzc2NzIsInByb3ZpZGVyX2lkIjoiYW5vbnltb3VzIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2F0Yi1tb2JpbGl0eS1wbGF0Zm9ybS1zdGFnaW5nIiwiYXVkIjoiYXRiLW1vYmlsaXR5LXBsYXRmb3JtLXN0YWdpbmciLCJhdXRoX3RpbWUiOjE2Mzg0NDMzODYsInVzZXJfaWQiOiI3bko5UEx6Qk4yUHBsYWJYM3VCQnM1enJrbmwyIiwic3ViIjoiN25KOVBMekJOMlBwbGFiWDN1QkJzNXpya25sMiIsImlhdCI6MTYzOTcyODU4NiwiZXhwIjoxNjM5NzMyMTg2LCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7fSwic2lnbl9pbl9wcm92aWRlciI6ImFub255bW91cyJ9fQ',
};

export async function listRecentFareContracts(): Promise<RecentFareContract[]> {
  const url = 'ticket/v2/ticket/recent';
  const response = await client.get<RecentFareContract[]>(url, {
    authWithIdToken: true,
  });

  return response.data;
}

export type OfferSearchParams = {
  zones: string[];
  travellers: {id: string; user_type: string; count: number}[];
  products: string[];
  travel_date?: string;
};

export async function listRecurringPayments(): Promise<RecurringPayment[]> {
  const url = 'ticket/v2/recurring-payments';
  const response = await client.get<RecurringPayment[]>(url, {
    authWithIdToken: true,
  });
  return response.data;
}

type ReserveOfferParams = {
  offers: ReserveOffer[];
  paymentType: PaymentType;
  opts?: AxiosRequestConfig;
  scaExemption: boolean;
};

export type ReserveOfferWithSavePaymentParams = ReserveOfferParams & {
  savePaymentMethod: boolean;
};

export type ReserveOfferWithRecurringParams = ReserveOfferParams & {
  recurringPaymentId: number;
};

export async function searchOffers(
  params: OfferSearchParams,
  opts?: AxiosRequestConfig,
): Promise<Offer[]> {
  const url = 'ticket/v1/search/zones';
  const response = await client.post<Offer[]>(url, params, opts);

  return response.data;
}

export async function sendReceipt(
  order_id: string,
  order_version: number,
  email: string,
) {
  const url = 'ticket/v1/receipt';
  const response = await client.post<SendReceiptResponse>(url, {
    order_id,
    order_version,
    email_address: email,
  });

  return response.data;
}

export async function reserveOffers(
  res: ReserveOfferWithSavePaymentParams,
): Promise<TicketReservation>;
export async function reserveOffers(
  res: ReserveOfferWithRecurringParams,
): Promise<TicketReservation>;
export async function reserveOffers({
  offers,
  paymentType,
  opts,
  scaExemption,
  ...rest
}:
  | ReserveOfferWithSavePaymentParams
  | ReserveOfferWithRecurringParams): Promise<TicketReservation> {
  const url = 'ticket/v2/reserve';
  let body: ReserveOfferRequestBody = {
    payment_redirect_url:
      'atb://ticketing?transaction_id={transaction_id}&payment_id={payment_id}',
    offers,
    payment_type: paymentType,
    store_payment:
      'savePaymentMethod' in rest ? rest.savePaymentMethod : undefined,
    recurring_payment_id:
      'recurringPaymentId' in rest ? rest.recurringPaymentId : undefined,
    sca_exemption: scaExemption,
  };
  const response = await client.post<TicketReservation>(url, body, {
    ...opts,
    authWithIdToken: true,
  });
  return response.data;
}

export async function getPayment(paymentId: number): Promise<PaymentResponse> {
  const url = 'ticket/v1/payments/' + paymentId;
  const response = await client.get<PaymentResponse>(url);
  return response.data;
}
