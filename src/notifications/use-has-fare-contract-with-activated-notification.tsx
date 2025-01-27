import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {useFareContracts} from '@atb/ticketing';
import {useNotificationsContext} from '@atb/notifications';
import {useTimeContext} from '@atb/time';

export function useHasFareContractWithActivatedNotification(): boolean {
  const {config: notificationsConfig} = useNotificationsContext();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {serverNow} = useTimeContext();
  const {fareContracts: validFareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );

  if (!notificationsConfig) return false;

  return validFareContracts.some((validFareContract) => {
    const firstTravelRight = validFareContract.travelRights[0];

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
