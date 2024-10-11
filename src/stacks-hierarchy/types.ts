import {PaymentType, RecurringPayment} from '@atb/ticketing';
import {FareProductTypeConfig, PreassignedFareProduct} from "@atb/configuration";
import {UserProfileWithCount} from "@atb/fare-contracts";
import {TariffZoneWithMetadata} from "@atb/tariff-zones-selector";
import {StopPlaceFragmentWithIsFree} from "@atb/harbors/types.ts";

export enum SavedPaymentMethodType {
  /**
   * Contains only the type of payment, and no payment details. When used, the
   * user has to enter the payment details manually or pay through a third party
   * like Vipps.
   */
  Normal = 'normal',
  /**
   * Contains the type of payment and information to enable automatic payment
   * without entering more payment details. BankID might still be required.
   */
  Recurring = 'recurring',
}

type CardPaymentMethod = {
  savedType: SavedPaymentMethodType;
  paymentType: PaymentType.Mastercard | PaymentType.Visa;
  recurringCard?: RecurringPayment;
};
type VippsPaymentMethod = {
  savedType: SavedPaymentMethodType.Normal;
  paymentType: PaymentType.Vipps;
  recurringCard?: undefined;
};
export type PaymentMethod = CardPaymentMethod | VippsPaymentMethod;

export type PurchaseSelectionType = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  fromPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  toPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  travelDate?: string;
};
