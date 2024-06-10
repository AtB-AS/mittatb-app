import {
  findReferenceDataById,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {useValidRightNowFareContract} from '@atb/ticketing';
import {useNotifications} from '@atb/notifications';

export function useHasFareContractWithActivatedNotification(): boolean {
  const {config: notificationsConfig} = useNotifications();
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const validFareContracts = useValidRightNowFareContract();

  if (!notificationsConfig) return false;

  return validFareContracts.some((validFareContract) => {
    const fareProductRef = validFareContract.travelRights[0]?.fareProductRef;

    if (!fareProductRef) {
      return false;
    }

    const preassignedFareProduct = findReferenceDataById(
      preassignedFareProducts,
      fareProductRef,
    );

    return notificationsConfig?.groups.some(
      (group) => group.id === preassignedFareProduct?.type && group.enabled,
    );
  });
}
