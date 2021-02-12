import {AxiosRequestConfig} from 'axios';
import auth from '@react-native-firebase/auth';
import client from './client';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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

enum TravelRightStatus {
  UNSPECIFIED = 0,
  RESERVED = 1,
  ORDERED = 2,
  PAID_FOR = 3,
  UNUSED = 4,
  ACTIVATED = 5,
  PARTIALLY_USED = 6,
  USED = 7,
  ARCHIVED = 8,
  OTHER = 9,
  CANCELLED = 20,
  REFUNDED = 21,
}

export type TravelRight = {
  id: string;
  status: TravelRightStatus;
  type:
    | 'PreActivatedSingleTicket'
    | 'PreActivatedPeriodTicket'
    | 'UnknownTicket';
};

export type Timestamp = FirebaseFirestoreTypes.Timestamp;
export type Blob = FirebaseFirestoreTypes.Blob;

export type PreactivatedTicket = TravelRight & {
  fareProductRef: string;
  startDateTime: Timestamp;
  endDateTime: Timestamp;
  usageValidityPeriodRef: string;
  userProfileRef: string;
  authorityRefs: string[];
  tariffZoneRefs: string[];
};

export type PreactivatedSingleTicket = PreactivatedTicket & {
  type: 'PreActivatedSingleTicket';
};

export type PeriodTicket = PreactivatedTicket & {
  type: 'PreActivatedPeriodTicket';
};

export type FareContract = {
  created: Timestamp;
  version: string;
  id: string;
  orderId: string;
  state: FareContractState;
  minimumSecurityLevel: number;
  travelRights: TravelRight[];
  qrCode: Blob;
};

export function isPreactivatedTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedTicket {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket'
  );
}

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}

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
