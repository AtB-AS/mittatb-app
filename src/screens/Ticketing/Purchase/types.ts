import {RootNavigationProps, RootStackScreenProps} from '@atb/navigation/types';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {PaymentType, ReserveOffer} from '@atb/ticketing';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RouteParams as ConfirmationRouteParams} from './Confirmation';
import {
  RouteParams as TariffZonesParams,
  TariffZoneWithMetadata,
} from './TariffZones';
import {RouteParams as TariffZoneSearchParams} from './TariffZones/search';
import {UserProfileWithCount} from './Travellers/use-user-count-state';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';

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
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  travelDate?: string;
};

type PaymentParams = {
  offers: ReserveOffer[];
  preassignedFareProduct: PreassignedFareProduct;
};

export type PurchaseStackParams = {
  PurchaseOverview: PurchaseOverviewParams;
  TariffZones: TariffZonesParams;
  TariffZoneSearch: TariffZoneSearchParams;
  Confirmation: ConfirmationRouteParams;
  PaymentCreditCard: PaymentParams & {paymentMethod: CardPaymentMethod};
  PaymentVipps: PaymentParams;
  Splash: undefined;
  ConsequencesFromPurchase: undefined;
};

export type PurchaseStackRootProps = RootStackScreenProps<'Purchase'>;

export type PurchaseNavigationProps<T extends keyof PurchaseStackParams> =
  CompositeNavigationProp<
    StackNavigationProp<PurchaseStackParams, T>,
    RootNavigationProps
  >;

export type PurchaseScreenProps<T extends keyof PurchaseStackParams> =
  CompositeScreenProps<
    StackScreenProps<PurchaseStackParams, T>,
    PurchaseStackRootProps
  >;
