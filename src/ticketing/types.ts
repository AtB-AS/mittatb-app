import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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
    | 'CarnetTicket'
    | 'NightTicket'
    | 'UnknownTicket';
};

export type Timestamp = FirebaseFirestoreTypes.Timestamp;

export type NormalTravelRight = TravelRight & {
  fareProductRef: string;
  startDateTime: Timestamp;
  endDateTime: Timestamp;
  usageValidityPeriodRef: string;
  userProfileRef: string;
  tariffZoneRefs: string[] | undefined;
};

export type PreActivatedTravelRight = NormalTravelRight;

export type CarnetTravelRightUsedAccess = {
  startDateTime: Timestamp;
  endDateTime: Timestamp;
};

export type CarnetTravelRight = NormalTravelRight & {
  type: 'CarnetTicket';
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
  usedAccesses: CarnetTravelRightUsedAccess[];
};

export type PreActivatedSingleTravelRight = PreActivatedTravelRight & {
  type: 'PreActivatedSingleTicket';
};

export type PeriodTravelRight = PreActivatedTravelRight & {
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
  qrCode: string;
  paymentType?: string;
};

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}

export type Reservation = {
  created: Timestamp;
  orderId: string;
  paymentId: number;
  transactionId: number;
  paymentType: PaymentType;
  paymentStatus?: PaymentStatus;
  url: string;
};

export enum PaymentType {
  Vipps = 2,
  Visa = 3,
  Mastercard = 4,
}

export type RecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type PaymentStatus =
  | 'AUTHENTICATE'
  | 'CANCEL'
  | 'CAPTURE'
  | 'CREATE'
  | 'CREDIT'
  | 'IMPORT'
  | 'INITIATE'
  | 'REJECT';

export type PaymentResponse = {
  order_id: string;
  payment_type: string;
  status: PaymentStatus;
};

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

export type RecentFareContractBackend = {
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

export type ReserveOfferRequestBody = {
  payment_redirect_url: string | undefined;
  offers: ReserveOffer[];
  payment_type: PaymentType;
  store_payment: boolean | undefined;
  recurring_payment_id: number | undefined;
  sca_exemption: boolean;
};

export type OfferReservation = {
  order_id: string;
  payment_id: number;
  transaction_id: number;
  url: string;
  recurring_payment_id?: number;
};

export type VippsRedirectParams = {
  payment_id: string;
  transaction_id: string;
  status: string;
};

export type SendReceiptResponse = {
  reference: string;
};

export type CustomerProfile = {
  email?: string;
  firstName?: string;
  id?: string;
  surname?: string;
  travelcard?: TravelCard;
  debug?: boolean;
  enableMobileToken?: boolean;
};

export type TravelCard = {
  expires: Timestamp;
  id: number;
  token_id?: string;
};
