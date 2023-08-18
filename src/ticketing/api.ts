import {APP_SCHEME} from '@env';
import {AxiosRequestConfig} from 'axios';
import {ReserveOfferRequestBody} from '.';
import {client} from '../api';
import {
  Offer,
  OfferReservation,
  PaymentType,
  RecentFareContractBackend,
  RecurringPayment,
  ReserveOffer,
  SendReceiptResponse,
} from './types';

export async function listRecentFareContracts(): Promise<
  RecentFareContractBackend[]
> {
  const url = 'ticket/v3/recent';
  const response = await client.get<RecentFareContractBackend[]>(url, {
    authWithIdToken: true,
  });
  console.log('BE: ' + JSON.stringify(response.data));
  return response.data;
}

export type OfferSearchParams = SearchParams &
  (ZoneOfferSearchParams | StopPlaceOfferSearchParams);

type SearchParams = {
  travellers: Traveller[];
  products: string[];
  travel_date?: string;
};

type ZoneOfferSearchParams = {
  zones: string[];
};

type StopPlaceOfferSearchParams = {
  from: string;
  to: string;
};
type Traveller = {
  id: string;
  user_type: string;
  count: number;
};

export async function listRecurringPayments(): Promise<RecurringPayment[]> {
  const url = 'ticket/v3/recurring-payments';
  const response = await client.get<RecurringPayment[]>(url, {
    authWithIdToken: true,
  });
  return response.data;
}

export async function deleteRecurringPayment(paymentId: number) {
  const url = `ticket/v3/recurring-payments/${paymentId}`;
  await client.delete<void>(url, {authWithIdToken: true});
}

type ReserveOfferParams = {
  offers: ReserveOffer[];
  paymentType: PaymentType;
  opts?: AxiosRequestConfig;
  scaExemption: boolean;
  customerAccountId: string;
};

export type ReserveOfferWithSavePaymentParams = ReserveOfferParams & {
  savePaymentMethod: boolean;
};

export type ReserveOfferWithRecurringParams = ReserveOfferParams & {
  recurringPaymentId: number;
};

export async function searchOffers(
  offerEndpoint: string,
  params: OfferSearchParams,
  opts?: AxiosRequestConfig,
): Promise<Offer[]> {
  const url = `ticket/v3/search/${offerEndpoint}`;

  const response = await client.post<Offer[]>(url, params, opts);

  return response.data;
}

export async function sendReceipt(
  order_id: string,
  order_version: number,
  email: string,
) {
  const url = 'ticket/v3/receipt';
  const response = await client.post<SendReceiptResponse>(url, {
    order_id,
    order_version,
    email_address: email,
  });

  return response.data;
}

export async function reserveOffers(
  res: ReserveOfferWithSavePaymentParams,
): Promise<OfferReservation>;
export async function reserveOffers(
  res: ReserveOfferWithRecurringParams,
): Promise<OfferReservation>;
export async function reserveOffers({
  offers,
  paymentType,
  opts,
  scaExemption,
  customerAccountId,
  ...rest
}:
  | ReserveOfferWithSavePaymentParams
  | ReserveOfferWithRecurringParams): Promise<OfferReservation> {
  const url = 'ticket/v3/reserve';
  const body: ReserveOfferRequestBody = {
    payment_redirect_url: `${APP_SCHEME}://ticketing?transaction_id={transaction_id}&payment_id={payment_id}`,
    offers,
    payment_type: paymentType,
    store_payment:
      'savePaymentMethod' in rest ? rest.savePaymentMethod : undefined,
    recurring_payment_id:
      'recurringPaymentId' in rest ? rest.recurringPaymentId : undefined,
    sca_exemption: scaExemption,
    customer_account_id: customerAccountId,
  };
  const response = await client.post<OfferReservation>(url, body, {
    ...opts,
    authWithIdToken: true,
  });
  return response.data;
}

export async function cancelPayment(
  payment_id: number,
  transaction_id: number,
): Promise<void> {
  const url = `ticket/v3/payments/${payment_id}/transactions/${transaction_id}/cancel`;
  await client.put<void>(
    url,
    {},
    {
      authWithIdToken: true,
      retry: true,
    },
  );
}
