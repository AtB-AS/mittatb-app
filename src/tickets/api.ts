import auth from '@react-native-firebase/auth';
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
  const user = auth().currentUser;
  const idToken = await user?.getIdToken();

  const url = 'ticket/v1/ticket/recent';
  const response = await client.get<RecentFareContract[]>(url, {
    headers: {
      Authorization: 'Bearer ' + idToken,
    },
  });

  return response.data;
}

export type OfferSearchParams = {
  zones: string[];
  travellers: {id: string; user_type: string; count: number}[];
  products: string[];
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
  offers: ReserveOffer[],
  paymentType: PaymentType,
  opts?: AxiosRequestConfig,
) {
  const user = auth().currentUser;
  const idToken = await user?.getIdToken();
  const url = 'ticket/v1/reserve';
  const response = await client.post<TicketReservation>(
    url,
    {
      payment_type: paymentType === 'creditcard' ? 1 : 2,
      payment_redirect_url:
        paymentType == 'vipps'
          ? 'atb://vipps?transaction_id={transaction_id}&payment_id={payment_id}'
          : undefined,
      offers,
    },
    {
      ...opts,
      headers: {
        Authorization: 'Bearer ' + idToken,
      },
    },
  );
  return response.data;
}

export async function getPayment(paymentId: number): Promise<PaymentResponse> {
  const url = 'ticket/v1/payments/' + paymentId;
  const response = await client.get<PaymentResponse>(url);
  return response.data;
}
