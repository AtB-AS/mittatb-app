import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {RootNavigationProps, RootStackScreenProps} from '@atb/navigation/types';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
} from '@atb/reference-data/types';
import {PaymentType, ReserveOffer} from '@atb/tickets';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RouteParams as ConfirmationRouteParams} from './Confirmation';
import {
  RouteParams as TariffZonesParams,
  TariffZoneWithMetadata,
} from './TariffZones';
import {RouteParams as TariffZoneSearchParams} from './TariffZones/search';

export type CardPaymentMethod =
  | {paymentType: PaymentType.Visa | PaymentType.Mastercard; save: boolean}
  | {
      paymentType: PaymentType.Visa | PaymentType.Mastercard;
      recurringPaymentId: number;
    };

export type VippsPaymentMethod = {
  paymentType: PaymentType.Vipps;
};

export type PaymentMethod = VippsPaymentMethod | CardPaymentMethod;

export type SavedRecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type DefaultPaymentOption = {
  savedType: 'normal';
  paymentType: PaymentType;
};
export type RecurringPaymentOption = {
  savedType: 'recurring';
  paymentType: PaymentType.Visa | PaymentType.Mastercard;
  recurringCard: SavedRecurringPayment;
};
export type RecurringPaymentWithoutCardOption = {
  savedType: 'recurring-without-card';
  paymentType: PaymentType.Visa | PaymentType.Mastercard;
  recurringPaymentId: number;
};

export type SavedPaymentOption =
  | DefaultPaymentOption
  | RecurringPaymentOption
  | RecurringPaymentWithoutCardOption;

// Routing

type PurchaseOverviewParams = {
  refreshOffer?: boolean;
  selectableProductType?: PreassignedFareProductType;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  travelDate?: string;
};

type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketingStackParams = {
  PurchaseOverview: PurchaseOverviewParams;
  TariffZones: TariffZonesParams;
  TariffZoneSearch: TariffZoneSearchParams;
  Confirmation: ConfirmationRouteParams;
  PaymentCreditCard: PaymentParams & {paymentMethod: CardPaymentMethod};
  PaymentVipps: PaymentParams;
  Splash: undefined;
  ConsequencesFromTicketPurchase: undefined;
};

export type TicketPurchaseStackRootProps =
  RootStackScreenProps<'TicketPurchase'>;

export type TicketPurchaseNavigationProps<
  T extends keyof TicketingStackParams,
> = CompositeNavigationProp<
  DismissableStackNavigationProp<TicketingStackParams, T>,
  RootNavigationProps
>;

export type TicketPurchaseScreenProps<T extends keyof TicketingStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketingStackParams, T>,
    TicketPurchaseStackRootProps
  > & {
    navigation: TicketPurchaseNavigationProps<T>;
  };
