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
  BankAxept = 6,
  ApplePay = 7,
  GooglePay = 8,
}

export type RecurringPayment = {
  id: number;
  expiresAt: string;
  cardExpiresAt: string;
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

export type FlexDiscountLadder = {
  current: number;
  steps: {
    expires?: string;
    discount: number; // The discount percentage
  }[];
};

/**
 * Defined by `OrderDetails` in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/order.rs
 */
export type RecentOrderDetails = {
  direction?: string;
  products: string[];
  zones?: string[];
  users: {[userProfile: string]: number};
  paymentMethod: string;
  totalAmount: string;
  createdAt: string;
  pointToPointValidity?: {
    fromPlace: string;
    toPlace: string;
  };
};

export type ReserveOffer = {
  offerId: string;
  count: number;
  selectableProductIds?: string[];
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
  recurringPaymentId?: number;
  /**
   * Payment type and the store payment flag should be provided if not using a
   * previously stored payment card
   */
  paymentType?: PaymentType;
  storePayment?: boolean;
  /**
   * Paying customer's phone number, with country prefix. The phone number and
   * redirect URL is only required for mobile payments types, e.g. Vipps.
   */
  phoneNumber?: string;
  paymentRedirectUrl?: string;
  scaExemption?: boolean;
  /** Only needed if fare contract should be created on a different account */
  customerAccountId?: string;
  /**
   * Only needed if fare contract should be created on a different account
   * which should be saved.
   */
  storeAlias?: {
    alias: string;
    /** With country prefix */
    phoneNumber: string;
  };
  /**
   * Uses auto sale for Nets. Defaults to false.
   * https://developer.nexigroup.com/netaxept/en-EU/api/rest-v1/#netaxept-registeraspx-get-parameters-autosale
   */
  autoSale?: boolean;
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
  orderId: string;
  paymentId?: number;
  transactionId?: number;
  url?: string;
  recurringPaymentId?: number;
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

/**
 * Defined by ConsumableSchoolCarnetResponse in
 * https://github.com/AtB-AS/ticket/blob/main/ticket-service/src/handlers.rs#L280
 *
 * @todo Use zod instead
 */
export type ConsumableSchoolCarnetResponse = {
  nextConsumableDateTime?: string | null;
  maximumNumberOfAccessesPerDay: number;
  numberOfUsedAccessesForToday: number;
};
