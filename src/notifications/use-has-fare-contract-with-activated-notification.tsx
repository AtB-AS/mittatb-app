import {
  findReferenceDataById,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {
  isNormalTravelRight,
  useValidRightNowFareContract,
} from '@atb/ticketing';
import {useNotifications} from '@atb/notifications';

export function useHasFareContractWithActivatedNotification(): boolean {
  const {config: notificationsConfig} = useNotifications();
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const validFareContracts = useValidRightNowFareContract();

  if (!notificationsConfig) return false;

  return validFareContracts.some((validFareContract) => {
    const firstTravelRight = validFareContract.travelRights[0];

    if (!isNormalTravelRight(firstTravelRight)) {
      return false;
    }

    if (!firstTravelRight.fareProductRef) {
      return false;
    }

    const preassignedFareProduct = findReferenceDataById(
      preassignedFareProducts,
      firstTravelRight.fareProductRef,
    );

    return notificationsConfig?.groups.some(
      (group) => group.id === preassignedFareProduct?.type && group.enabled,
    );
  });
}
