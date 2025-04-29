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
  PaymentCard = 1,
  Vipps = 2,
  Visa = 3,
  Mastercard = 4,
  Amex = 5,
}

export type RecurringPayment = {
  id: number;
  expiresAt: string;
  maskedPan: string;
  paymentType: number;
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
  amountFloat?: number;
  currency: string;
  vatGroup?: string;
  taxAmount?: string;
  originalAmount: string;
  originalAmountFloat?: number;
  originalTaxAmount?: string;
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
  offerId: string;
  travellerId: string;
  route?: Route;
  userProfileId?: string;
  userProfileIds: string[];
  price: OfferPrice;
  fareProduct?: string;
  flexDiscountLadder?: FlexDiscountLadder;
  validFrom?: string;
  validTo?: string;
  shouldStartNow: boolean;
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

/**
 * Defined by `ReserveOfferRequest` in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/reserve.rs
 */
export type ReserveOfferRequest = {
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

/**
 * Defined by `ReserveOfferResponse` in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/reserve.rs
 */
export type ReserveOfferResponse = {
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
  recurringPaymentId: number;
  terminalUrl: string;
};

/**
 * Defined by RefundOptionsResponse in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/refund.rs
 */
export type RefundOptions = {
  isRefundable: boolean;
};
