import {PreassignedFareProduct, UserProfile} from '@atb/reference-data/types';
import {PaymentType} from '@atb/tickets/types';
import {format, parseISO} from 'date-fns';
import {useMemo} from 'react';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
} from '@atb/translations';
import {UserProfileWithCount} from './Travellers/use-user-count-state';
import {formatToLongDateTime} from '@atb/utils/date';
import {getReferenceDataName} from '@atb/reference-data/utils';

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
};

export const getPurchaseFlow = (
  product: PreassignedFareProduct,
): PurchaseFlow => {
  switch (product.type) {
    case 'period':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
      };
    case 'hour24':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: true,
      };
    case 'single':
      return {
        travellerSelectionMode: 'multiple',
        travelDateSelectionEnabled: false,
      };
    case 'carnet':
      return {
        travellerSelectionMode: 'single',
        travelDateSelectionEnabled: false,
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

export function createTravellersText(
  userProfilesWithCount: UserProfileWithCount[],
  /**
   * shortened Shorten text if more than two traveller groups, making
   * '2 adults, 1 child, 2 senior' become '5 travellers'.
   */
  shortened: boolean,
  /**
   * prefixed Prefix the traveller selection with text signalling it is the current
   * selection.
   */
  prefixed: boolean,
  t: TranslateFunction,
  language: Language,
) {
  const chosenUserProfiles = userProfilesWithCount.filter((u) => u.count);

  const prefix = prefixed ? t(PurchaseOverviewTexts.travellers.prefix) : '';

  if (chosenUserProfiles.length === 0) {
    return prefix + t(PurchaseOverviewTexts.travellers.noTravellers);
  } else if (chosenUserProfiles.length > 2 && shortened) {
    const totalCount = chosenUserProfiles.reduce(
      (total, u) => total + u.count,
      0,
    );
    return (
      prefix + t(PurchaseOverviewTexts.travellers.travellersCount(totalCount))
    );
  } else {
    return (
      prefix +
      chosenUserProfiles
        .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
        .join(', ')
    );
  }
}

export function createTravelDateText(
  t: TranslateFunction,
  language: Language,
  travelDate?: string,
) {
  return travelDate
    ? t(
        PurchaseOverviewTexts.travelDate.futureDate(
          formatToLongDateTime(travelDate, language),
        ),
      )
    : t(PurchaseOverviewTexts.travelDate.now);
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
