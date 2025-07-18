import {findReferenceDataById} from '@atb/modules/configuration';
import {
  useFareContracts,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {useNotificationsContext} from './use-push-notifications';
import {useTimeContext} from '@atb/modules/time';

export function useHasFareContractWithActivatedNotification(): boolean {
  const {config: notificationsConfig} = useNotificationsContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
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
