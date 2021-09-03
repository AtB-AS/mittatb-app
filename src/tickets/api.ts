import {AxiosRequestConfig} from 'axios';
import {client} from '../api';
import {
  Offer,
  PaymentResponse,
  PaymentType,
  RecentFareContract,
  ReserveOffer,
  SendReceiptResponse,
  TicketReservation,
} from './types';

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

export type RecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type ReserveOfferParams = {
  offers: ReserveOffer[];
  paymentType: number;
  savePaymentMethod?: boolean;
  opts?: AxiosRequestConfig;
};

export type ReserveOfferWithRecurringParams = ReserveOfferParams & {
  recurringPaymentId: string;
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

export async function reserveOffersWithRecurring({
  offers,
  paymentType,
  recurringPaymentId,
  opts,
}: ReserveOfferWithRecurringParams) {
  const url = 'ticket/v2/reserve';
  let body: object = {
    payment_redirect_url:
      paymentType == 2
        ? 'atb://vipps?transaction_id={transaction_id}&payment_id={payment_id}'
        : undefined,
    offers,
    payment_type: paymentType,
    recurring_payment_id: parseInt(recurringPaymentId),
  };
  const response = await client.post<TicketReservation>(url, body, {
    ...opts,
    authWithIdToken: true,
  });
  return response.data;
}

export async function reserveOffers({
  offers,
  paymentType,
  savePaymentMethod = false,
  opts,
}: ReserveOfferParams) {
  const url = 'ticket/v2/reserve';
  let body: object = {
    payment_redirect_url:
      paymentType == 2
        ? 'atb://vipps?transaction_id={transaction_id}&payment_id={payment_id}'
        : undefined,
    offers,
    payment_type: paymentType,
    ...(savePaymentMethod ? {store_payment: savePaymentMethod} : {}),
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
