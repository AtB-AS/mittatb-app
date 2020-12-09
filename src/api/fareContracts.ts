import {AxiosRequestConfig} from 'axios';
import {getCustomerId} from '../utils/customerId';
import client from './client';
import {LanguageAndText} from './utils';

export async function listFareContracts(): Promise<FareContract[]> {
  const customerId = await getCustomerId();

  const url = 'ticket/v1/ticket/' + customerId;
  const response = await client.get<ListTicketsResponse>(url);

  return response.data.fare_contracts;
}

export async function listPreassignedFareProducts() {
  const url = '/reference-data/v1/ATB/preassigned-fare-products';
  const response = await client.get<PreassignedFareProduct[]>(url, {
    retry: true,
  });
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
  const url = 'ticket/v1/search';
  const response = await client.post<Offer[]>(url, params, opts);

  return response.data;
}

interface SendReceiptResponse {
  reference: string;
}

export async function sendReceipt(fc: FareContract, email: string) {
  const url = 'ticket/v1/receipt';
  const response = await client.post<SendReceiptResponse>(url, {
    order_id: fc.order_id,
    order_version: parseInt(fc.order_version, 10),
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
  user_profiles: string[];
};

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndText;
  description: LanguageAndText;
  alternativeNames: LanguageAndText[];
};

type ListTicketsResponse = {
  fare_contracts: FareContract[];
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
