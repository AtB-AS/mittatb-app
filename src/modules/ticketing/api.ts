import {APP_SCHEME} from '@env';
import {AxiosRequestConfig} from 'axios';
import {AddPaymentMethodResponse, ReserveOfferRequest} from '.';
import {FareContractType, type TicketOffer} from '@atb-as/utils';
import {client} from '@atb/api';
import {
  ReserveOfferResponse,
  PaymentType,
  RecentOrderDetails,
  RecurringPayment,
  RefundOptions,
  ReserveOffer,
  SendReceiptResponse,
  TicketRecipientType,
  ConsumableSchoolCarnetResponse,
} from './types';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {convertIsoStringFieldsToDate} from '@atb/utils/date';
import capitalize from 'lodash/capitalize';
import qs from 'query-string';
import {isDefined} from '@atb/utils/presence';

export async function listRecentFareContracts(): Promise<RecentOrderDetails[]> {
  const url = 'sales/v1/order/recent';
  const response = await client.get<RecentOrderDetails[]>(url, {
    authWithIdToken: true,
  });
  return response.data;
}

export type OfferSearchParams = {
  isOnBehalfOf: boolean;
  travellers: Traveller[];
  products: string[];
  travelDate?: string;
  zones?: string[];
  from?: string;
  to?: string;
};

type Traveller = {
  id: string;
  userType: string;
  count: number;
};

export async function listRecurringPayments(): Promise<RecurringPayment[]> {
  const url = 'sales/v1/recurring-payments';

  const response = await client.get<RecurringPayment[]>(url, {
    authWithIdToken: true,
  });

  return response.data;
}

export async function addPaymentMethod(
  paymentRedirectUrl: string,
): Promise<AddPaymentMethodResponse> {
  const url = `sales/v1/recurring-payments`;

  const response = await client.post<AddPaymentMethodResponse>(
    url,
    {paymentRedirectUrl},
    {authWithIdToken: true},
  );

  return response.data;
}

export async function deleteRecurringPayment(paymentId: number) {
  const url = `sales/v1/recurring-payments/${paymentId}`;
  await client.delete<void>(url, {authWithIdToken: true});
}

export async function cancelRecurringPayment(paymentId: number) {
  const url = `sales/v1/recurring-payments/${paymentId}/cancel`;
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

export async function getSchoolCarnetInfo(fareContractId: string) {
  const url = `ticket/v4/consumable/school-carnet/${fareContractId}`;
  const response = await client.get<ConsumableSchoolCarnetResponse>(url, {
    authWithIdToken: true,
  });
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
): Promise<TicketOffer[]> {
  const url = `sales/v1/search/${offerEndpoint}`;

  const response = await client.post<TicketOffer[]>(url, params, opts);

  return response.data;
}

export async function sendReceipt(
  orderId: string,
  orderVersion: number,
  emailAddress: string,
) {
  const url = 'sales/v1/receipt';

  const response = await client.post<SendReceiptResponse>(url, {
    orderId,
    orderVersion,
    emailAddress,
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
  shouldSavePaymentMethod,
  recurringPaymentId,
}: ReserveOfferParams): Promise<ReserveOfferResponse> {
  const url = 'sales/v1/reserve';

  const body: ReserveOfferRequest = {
    paymentRedirectUrl: `${APP_SCHEME}://purchase-callback`,
    offers,
    paymentType,
    storePayment: shouldSavePaymentMethod,
    recurringPaymentId,
    scaExemption,
    customerAccountId,
    autoSale,
    phoneNumber,
    storeAlias: recipient?.name
      ? {alias: recipient.name, phoneNumber: recipient.phoneNumber}
      : undefined,
  };

  const response = await client.post<ReserveOfferResponse>(url, body, {
    ...opts,
    authWithIdToken: true,
  });

  return response.data;
}

export async function cancelPayment(
  paymentId: number,
  transactionId: number,
  isUser: boolean,
): Promise<void> {
  const url = `sales/v1/payments/${paymentId}/transactions/${transactionId}/cancel?isUser=${isUser}`;
  await client.put(url, undefined, {authWithIdToken: true});
}

export async function getFareProducts(): Promise<PreassignedFareProduct[]> {
  const url = 'product/v1';
  const response = await client.get<PreassignedFareProduct[]>(url, {
    authWithIdToken: true,
  });

  return response.data
    .map((p) => PreassignedFareProduct.safeParse(p).data)
    .filter(isDefined);
}

export async function getFareContracts(
  availability: 'available' | 'historical' | undefined,
): Promise<FareContractType[]> {
  const url = qs.stringifyUrl({
    url: 'ticket/v4/list',
    query: {
      availability: availability ? capitalize(availability) : undefined,
    },
  });
  const response = await client.get(url, {
    authWithIdToken: true,
  });
  const fareContracts = response.data.fareContracts.map(
    convertIsoStringFieldsToDate,
  );
  return fareContracts.filter(
    (fc: any) => FareContractType.safeParse(fc).success,
  );
}

export async function getRefundOptions(orderId: string) {
  const url = `sales/v1/refund/options/${orderId}`;
  const response = await client.get<RefundOptions>(url, {
    authWithIdToken: true,
  });
  return response.data;
}

export async function refundFareContract(orderId: string) {
  const url = `sales/v1/refund`;
  const response = await client.post(url, {orderId}, {authWithIdToken: true});
  return response.data;
}
