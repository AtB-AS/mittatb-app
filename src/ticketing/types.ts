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

export enum TravelRightDirection {
  Unspecified = '0',
  Both = '1',
  Forwards = '2',
  Backwards = '3',
}

export type TravelRight = {
  id: string;
  type: string;
};

export type NormalTravelRight = TravelRight & {
  fareProductRef: string;
  status: TravelRightStatus;
  startDateTime: Date;
  endDateTime: Date;
  usageValidityPeriodRef: string;
  userProfileRef: string;
  tariffZoneRefs?: string[];
  startPointRef?: string;
  endPointRef?: string;
  direction?: TravelRightDirection;
};

export type CarnetTravelRightUsedAccess = {
  startDateTime: Date;
  endDateTime: Date;
};

export type CarnetTravelRight = NormalTravelRight & {
  type: string;
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
  usedAccesses: CarnetTravelRightUsedAccess[];
};

export type UsedAccessStatus = 'valid' | 'upcoming' | 'inactive';

export type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

export type FareContract = {
  created: Date;
  version: string;
  id: string;
  customerAccountId: string;
  purchasedBy: string;
  orderId: string;
  state: FareContractState;
  minimumSecurityLevel: number;
  travelRights: TravelRight[];
  qrCode: string;
  totalAmount?: string;
  paymentType?: string[];
};

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}

export type Reservation = {
  created: Date;
  orderId: string;
  paymentId: number;
  transactionId: number;
  paymentType: PaymentType;
  paymentStatus?: PaymentStatus;
  customerAccountId?: string;
  url: string;
};

export enum PaymentType {
  Vipps = 2,
  Visa = 3,
  Mastercard = 4,
  Amex = 5,
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

export type FlexDiscountLadder = {
  current: number;
  steps: {
    expires?: string;
    discount: number; // The discount percentage
  }[];
};

export type OfferPrice = {
  amount: string;
  amount_float?: number;
  currency: string;
  vat_group?: string;
  tax_amount?: string;
  original_amount: string;
  original_amount_float?: number;
  original_tax_amount?: string;
};

enum RouteType {
  Zones,
  StopPlaces,
  Authority,
}

type Route = {
  type: RouteType;
  from?: string;
  to?: string;
};

export type Offer = {
  offer_id: string;
  traveller_id: string;
  route?: Route;
  user_profile_id?: string;
  user_profile_ids: string[];
  prices: OfferPrice[];
  fare_product?: string;
  flex_discount_ladder?: FlexDiscountLadder;
  valid_from?: string;
  valid_to?: string;
  should_start_now: boolean;
};

export type OfferSearchResponse = Offer[];

export type RecentFareContractBackend = {
  direction?: string;
  products: string[];
  zones: string[];
  users: {
    [user_profile: string]: string;
  };
  payment_method: string;
  total_amount: string;
  created_at: string;
  point_to_point_validity: {
    fromPlace: string;
    toPlace: string;
  };
};

export type ReserveOffer = {
  offer_id: string;
  count: number;
};

export type ReserveOfferRequestBody = {
  offers: ReserveOffer[];
  /**
   * Recurring payment id should be provided if using a previously stored
   * payment card
   */
  recurring_payment_id?: number;
  /**
   * Payment type and the store payment flag should be provided if not using a
   * previously stored payment card
   */
  payment_type?: PaymentType;
  store_payment?: boolean;
  /**
   * Paying customer's phone number, with country prefix. The phone number and
   * redirect URL is only required for mobile payments types, e.g. Vipps.
   */
  phone_number?: string;
  payment_redirect_url?: string;
  sca_exemption?: boolean;
  /** Only needed if fare contract should be created on a different account */
  customer_account_id?: string;
  /**
   * Only needed if fare contract should be created on a different account
   * which should be saved.
   */
  store_alias?: {
    alias: string;
    /** With country prefix */
    phone_number: string;
  };
  /** Experimental */
  auto_sale?: boolean;
};

export type TicketRecipientType = {
  accountId: string;
  phoneNumber: string;
  name?: string;
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
  debug?: boolean;
  subAccounts?: string[];
};

export type TravelCard = {
  expires: Date;
  id: number;
  token_id?: string;
};

export type AddPaymentMethodResponse = {
  recurring_payment_id: number;
  terminal_url: string;
};

export type AvailabilityStatus =
  | {availability: 'available'; status: 'upcoming' | 'valid'}
  | {
      availability: 'historic';
      status: 'expired' | 'empty' | 'refunded' | 'cancelled';
    }
  | {availability: 'invalid'; status: 'unspecified' | 'invalid'};
