import {AxiosRequestConfig} from 'axios';
import {getCustomerId} from '../utils/customerId';
import client from './client';

export async function listFareContracts(): Promise<FareContract[]> {
  const customerId = await getCustomerId();

  const url = 'ticket/v1/ticket/' + customerId;
  const response = await client.get<ListTicketsResponse>(url);

  return response.data.fare_contracts;
}

export async function listRecentFareContracts(): Promise<RecentFareContract[]> {
  const customerId = await getCustomerId();

  const url = 'ticket/v1/ticket/' + customerId + '/recent';
  const response = await client.get<RecentFareContract[]>(url);

  return response.data;
}

export type OfferSearchParams = {
  zones: string[];
  travellers: {id: string; user_type: string; count: number}[];
  products: string[];
};

export async function search(
  params: OfferSearchParams,
  opts?: AxiosRequestConfig,
): Promise<Offer[]> {
  const url = 'ticket/v1/search/zones';
  const response = await client.post<Offer[]>(url, params, opts);

  return response.data;
}

interface SendReceiptResponse {
  reference: string;
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

export type PaymentType = 'vipps' | 'creditcard';

export async function reserve(
  offers: ReserveOffer[],
  paymentType: PaymentType,
  opts?: AxiosRequestConfig,
) {
  const customer_id = await getCustomerId();

  const url = 'ticket/v1/reserve';
  const response = await client.post<TicketReservation>(
    url,
    {
      payment_type: paymentType === 'creditcard' ? 1 : 2,
      payment_redirect_url:
        paymentType == 'vipps'
          ? 'atb://vipps?transaction_id={transaction_id}&payment_id={payment_id}'
          : undefined,
      customer_id,
      offers,
    },
    opts,
  );
  return response.data;
}

export type PaymentStatus =
  | 'AUTHENTICATE'
  | 'CANCEL'
  | 'CAPTURE'
  | 'CREATE'
  | 'CREDIT'
  | 'IMPORT'
  | 'INITIATE'
  | 'REJECT';

type PaymentResponse = {
  order_id: string;
  payment_type: string;
  status: PaymentStatus;
};

export async function getPayment(paymentId: number): Promise<PaymentResponse> {
  const url = 'ticket/v1/payments/' + paymentId;
  const response = await client.get<PaymentResponse>(url);

  return response.data;
}

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
  travellers: FareContractTraveller[];
  state: FareContractLifecycleState;
  qr_code: string;
};

export type FareContractTraveller = {
  fare_product_ref: string;
  user_profile_ref: string;
  tariff_zone_refs: string[];
};

export enum FareContractLifecycleState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}

type ListTicketsResponse = {
  fare_contracts: FareContract[];
};

export type RecentFareContract = {
  products: string[];
  zones: string[];
  users: {
    [user_profile: string]: string;
  };
  payment_method: string;
  total_amount: string;
  created_at: string;
};

export type ReserveOffer = {
  offer_id: string;
  count: number;
};

export type TicketReservation = {
  order_id: string;
  payment_id: number;
  transaction_id: number;
  url: string;
};

export type VippsRedirectParams = {
  payment_id: string;
  transaction_id: string;
  status: string;
};
