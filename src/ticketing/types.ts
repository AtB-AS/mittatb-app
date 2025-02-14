import {z} from 'zod';

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

/**
 * For definition, see `UsedAccess` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const CarnetTravelRightUsedAccess = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
});
export type CarnetTravelRightUsedAccess = z.infer<
  typeof CarnetTravelRightUsedAccess
>;

/**
 * For definitions, see `TravelRight` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const TravelRight = z.object({
  id: z.string(),
  customerAccountId: z.string().optional(),
  status: z.nativeEnum(TravelRightStatus),
  fareProductRef: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  usageValidityPeriodRef: z.string(),
  userProfileRef: z.string(),
  authorityRef: z.string(),
  tariffZoneRefs: z.array(z.string()).optional(),
  fareZoneRefs: z.array(z.string()).optional(),
  startPointRef: z.string().optional(),
  endPointRef: z.string().optional(),
  direction: z.nativeEnum(TravelRightDirection).optional(),
  maximumNumberOfAccesses: z.number().optional(),
  numberOfUsedAccesses: z.number().optional(),
  usedAccesses: z.array(CarnetTravelRightUsedAccess).optional(),
});
export type TravelRight = z.infer<typeof TravelRight>;

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}
/**
 * For definition, see `FareContract` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/fare_contract.rs
 */
export const FareContract = z.object({
  created: z.date(),
  id: z.string(),
  customerAccountId: z.string(),
  orderId: z.string(),
  paymentType: z.array(z.string()),
  qrCode: z.string().optional(),
  state: z.nativeEnum(FareContractState),
  totalAmount: z.string(),
  totalTaxAmount: z.string(),
  travelRights: z.array(TravelRight).nonempty(),
  version: z.string(),
  purchasedBy: z.string().optional(),
});
export type FareContract = z.infer<typeof FareContract>;

export type UsedAccessStatus = 'valid' | 'upcoming' | 'inactive';

export type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

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
      availability: 'historical';
      status: 'expired' | 'empty' | 'refunded' | 'cancelled';
    }
  | {availability: 'invalid'; status: 'unspecified' | 'invalid'};
