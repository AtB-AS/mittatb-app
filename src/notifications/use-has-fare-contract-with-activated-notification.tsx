import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {
  isNormalTravelRight,
  useValidRightNowFareContract,
} from '@atb/ticketing';
import {useNotificationsContext} from '@atb/notifications';

export function useHasFareContractWithActivatedNotification(): boolean {
  const {config: notificationsConfig} = useNotificationsContext();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
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
