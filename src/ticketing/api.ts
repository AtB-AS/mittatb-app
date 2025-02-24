import {APP_SCHEME} from '@env';
import {AxiosRequestConfig} from 'axios';
import {AddPaymentMethodResponse, ReserveOfferRequestBody} from '.';
import {FareContractType} from '@atb-as/utils';
import {client} from '../api';
import {
  Offer,
  OfferReservation,
  PaymentType,
  RecentFareContractBackend,
  RecurringPayment,
  ReserveOffer,
  SendReceiptResponse,
  TicketRecipientType,
} from './types';
import {PreassignedFareProduct} from '@atb/configuration';
import {convertIsoStringFieldsToDate} from '@atb/utils/date';
import capitalize from 'lodash/capitalize';

export async function listRecentFareContracts(): Promise<
  RecentFareContractBackend[]
> {
  const url = 'ticket/v3/recent';
  const response = await client.get<RecentFareContractBackend[]>(url, {
    authWithIdToken: true,
  });
  return response.data;
}

export type OfferSearchParams = {
  is_on_behalf_of: boolean;
  travellers: Traveller[];
  products: string[];
  travel_date?: string;
  zones?: string[];
  from?: string;
  to?: string;
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
  const testResponse1 = [
    {
      card_expires_at: '2038-02-01T00:00:00Z',
      expires_at: '2025-03-15T14:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //30 DAYS BEFORE NETS
  const testResponse2 = [
    {
      card_expires_at: '2038-02-01T00:00:00Z',
      expires_at: '2025-02-13T00:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //EXPIRED NETS
  const testResponse3 = [
    {
      card_expires_at: '2025-03-14T14:33:34Z',
      expires_at: '2028-02-13T00:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //30 DAYS BEFORE CARD
  const testResponse4 = [
    {
      card_expires_at: '2025-02-13T06:33:34Z',
      expires_at: '2028-02-13T00:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //card expired

  const testResponse5 = [
    {
      card_expires_at: '2025-02-21T06:33:34Z',
      expires_at: '2025-02-22T00:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //card and nets at the same time
  const testResponse = [
    {
      card_expires_at: '2035-02-12T00:33:34Z',
      expires_at: '2028-02-13T00:33:34Z',
      id: 14900,
      masked_pan: '4847',
      payment_type: 3,
    },
  ]; //Default
  return response.data;
}

export async function addPaymentMethod(paymentRedirectUrl: string) {
  const url = `ticket/v3/recurring-payments`;
  return client.post<AddPaymentMethodResponse>(
    url,
    {paymentRedirectUrl},
    {authWithIdToken: true},
  );
}

export async function deleteRecurringPayment(paymentId: number) {
  const url = `ticket/v3/recurring-payments/${paymentId}`;
  await client.delete<void>(url, {authWithIdToken: true});
}

export async function cancelRecurringPayment(paymentId: number) {
  const url = `ticket/v3/recurring-payments/${paymentId}/cancel`;
  const response = await client.post<void>(url, {}, {authWithIdToken: true});
  return response.data;
}

export async function consumeCarnet(fareContractId: string) {
  const url = `ticket/v4/consume`;
  const response = await client.post<void>(
    url,
    {
      fareContractId,
    },
    {authWithIdToken: true},
  );
  return response.data;
}

export async function activateFareContractNow(fareContractId: string) {
  const url = `ticket/v4/start-time`;
  const response = await client.put<void>(
    url,
    {
      fareContractId,
    },
    {authWithIdToken: true},
  );
  return response.data;
}

type ReserveOfferParams = {
  offers: ReserveOffer[];
  paymentType: PaymentType;
  opts?: AxiosRequestConfig;
  scaExemption: boolean;
  customerAccountId: string;
  shouldSavePaymentMethod: boolean;
  recurringPaymentId?: number;
  autoSale: boolean;
  phoneNumber?: string;
  recipient?: TicketRecipientType;
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

export async function reserveOffers({
  offers,
  paymentType,
  opts,
  scaExemption,
  customerAccountId,
  autoSale,
  phoneNumber,
  recipient,
  ...rest
}: ReserveOfferParams): Promise<OfferReservation> {
  const url = 'ticket/v3/reserve';
  const body: ReserveOfferRequestBody = {
    payment_redirect_url: `${APP_SCHEME}://purchase-callback`,
    offers,
    payment_type: paymentType,
    store_payment: rest.shouldSavePaymentMethod,
    recurring_payment_id: rest.recurringPaymentId,
    sca_exemption: scaExemption,
    customer_account_id: customerAccountId,
    auto_sale: autoSale,
    phone_number: phoneNumber,
    store_alias: recipient?.name
      ? {alias: recipient.name, phone_number: recipient.phoneNumber}
      : undefined,
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
  await client.put(url, {}, {authWithIdToken: true});
}

export async function getFareProducts(): Promise<PreassignedFareProduct[]> {
  const url = 'product/v1';
  const response = await client.get<PreassignedFareProduct[]>(url, {
    authWithIdToken: true,
  });

  return response.data;
}

export async function getFareContracts(
  availability: 'available' | 'historical',
): Promise<FareContractType[]> {
  const url = `ticket/v4/list?availability=${capitalize(availability)}`;
  const response = await client.get(url, {
    authWithIdToken: true,
  });
  const fareContracts = response.data.fareContracts.map(
    convertIsoStringFieldsToDate,
  );
  // TODO: Log errors during parsing
  return fareContracts.filter(
    (fc: any) => FareContractType.safeParse(fc).success,
  );
}
