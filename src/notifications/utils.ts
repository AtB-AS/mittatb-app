import {NotificationConfig, NotificationConfigValue} from './types';
import {isDefined} from '@atb/utils/presence';
import {
  findReferenceDataById,
  PreassignedFareProduct,
} from '@atb/configuration';
import {FareContract} from '@atb/ticketing';

export function isConfigEnabled<T extends NotificationConfigValue>(
  config: T[] | undefined,
  key: T['id'],
): boolean {
  return config?.filter(isDefined).find((v) => v.id === key)?.enabled ?? false;
}

export function hasValidFareContractWithActivatedNotification(
  validFareContracts: FareContract[],
  preassignedFareProducts: PreassignedFareProduct[],
  config?: NotificationConfig,
): boolean {
  if (!config) return false;
  return validFareContracts.some((fareContract) => {
    const fareProductRef = fareContract.travelRights[0]?.fareProductRef;

    if (!fareProductRef) {
      return false;
    }

    const preassignedFareProduct = findReferenceDataById(
      preassignedFareProducts,
      fareProductRef,
    );

    return config?.groups.some(
      (group) => group.id === preassignedFareProduct?.type && group.enabled,
    );
  });
}
