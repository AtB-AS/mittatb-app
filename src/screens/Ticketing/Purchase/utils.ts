import {PreassignedFareProduct, UserProfile} from '@atb/reference-data/types';
import {PaymentType} from '@atb/tickets/types';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {format, parseISO} from 'date-fns';
import {useMemo} from 'react';

export type PurchaseFlow = {
  /**
   * Whether the traveller selection should allow a single traveller or
   * multiple travellers to be selected.
   */
  travellerSelectionMode: 'single' | 'multiple';

  /**
   * Whether the customer should be able to select a future start time for the
   * ticket.
   */
  travelDateSelectionEnabled: boolean;

  /**
   * Whether the customer should be able to select between a set of durations
   * for the ticket, based on `fareproduct.durationDays`.
   */
  durationSelectionEnabled: boolean;
};

export const getPurchaseFlow = (
  product: PreassignedFareProduct,
): PurchaseFlow => {
  switch (product.type) {
    case 'period':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
        durationSelectionEnabled: true,
      };
    case 'hour24':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
        durationSelectionEnabled: false,
      };
    case 'single':
      return {
        travellerSelectionMode: 'multiple',
        travelDateSelectionEnabled: false,
        durationSelectionEnabled: false,
      };
    case 'carnet':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: false,
        durationSelectionEnabled: false,
      };
  }
};

export function getExpireDate(iso: string): string {
  let date = parseISO(iso);
  return format(date, 'MM/yy');
}

export function getPaymentTypeName(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    default:
      return '';
  }
}

export type UserProfileTypeWithCount = {
  userTypeString: string;
  count: number;
};

/**
 * Get the default user profiles with count. If a default user profile has been
 * selected in the preferences that profile will have a count of one. If no
 * default user profile preference exists then the first user profile will have
 * a count of one.
 */
export function useTravellersWithPreselectedCounts(
  userProfiles: UserProfile[],
  defaultSelections: UserProfileTypeWithCount[],
  preassignedFareProduct: PreassignedFareProduct,
) {
  return useMemo(
    () =>
      userProfiles
        .filter((u) =>
          preassignedFareProduct.limitations.userProfileRefs.includes(u.id),
        )
        .map((u) => ({
          ...u,
          count: getCountIfUserIsIncluded(u, defaultSelections),
        })),
    [userProfiles, preassignedFareProduct],
  );
}

export function getCountIfUserIsIncluded(
  u: UserProfile,
  selections: UserProfileTypeWithCount[],
): number {
  const selectedUser = selections.filter(
    (up: UserProfileTypeWithCount) => up.userTypeString === u.userTypeString,
  );

  if (selectedUser.length < 1) return 0;
  return selectedUser[0].count;
}
