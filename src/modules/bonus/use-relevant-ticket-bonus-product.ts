import {useActiveBonusProductsQuery} from './queries';
import {
  BonusProductTypeEnum,
  type TicketRuleType,
  type BonusProductType,
} from './types';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export function useRelevantTicketBonusProduct(
  selection: PurchaseSelectionType,
): BonusProductType | undefined {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(true);

  if (selection.isOnBehalfOf) return undefined;
  if (selection.userProfilesWithCount.length !== 1) return undefined;
  if (selection.userProfilesWithCount[0].count !== 1) return undefined;

  return activeBonusProducts?.find(
    (p) =>
      p.productType === BonusProductTypeEnum.TICKET &&
      p.isActive &&
      matchesTicketRule(p.ticketRule, selection),
  );
}

function matchesTicketRule(
  rule: TicketRuleType | undefined,
  selection: PurchaseSelectionType,
): boolean {
  if (!rule) return false;

  const {preassignedFareProductIds, userProfiles, zoneIds} = rule;

  if (
    preassignedFareProductIds?.length &&
    !preassignedFareProductIds.includes(selection.preassignedFareProduct.id)
  ) {
    return false;
  }

  if (userProfiles?.length) {
    const selectedProfiles = selection.userProfilesWithCount.map((p) => p.id);
    if (!selectedProfiles.every((id) => userProfiles!.includes(id))) {
      return false;
    }
  }

  if (zoneIds?.length) {
    const selectedZones = [
      selection.zones?.from?.id,
      selection.zones?.to?.id,
    ].filter((id) => id !== undefined);
    if (!selectedZones.every((id) => zoneIds.includes(id))) {
      return false;
    }
  }

  return true;
}
