import {TripPattern} from '@atb/api/types/trips';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  useFareContracts,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {TripTicketCardMode} from './components/TripTicketCard';
import {getFareZoneIdsPerStop, isTripCoveredByFareContract} from './utils';

/**
 * 'valid' when one of the user's valid or upcoming fare contracts covers the
 * whole trip, otherwise 'invalid'.
 */
export const useTripTicketCardMode = (
  tripPattern: TripPattern,
  now: number,
): TripTicketCardMode => {
  const {fareZones, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {fareContracts} = useFareContracts({availability: 'available'}, now);

  const fareZoneIdsPerStop = getFareZoneIdsPerStop(tripPattern.legs, fareZones);
  if (!fareZoneIdsPerStop) return 'invalid';

  const isCovered = fareContracts.some((fareContract) =>
    isTripCoveredByFareContract(
      tripPattern.legs,
      fareZoneIdsPerStop,
      fareContract,
      preassignedFareProducts,
      fareProductTypeConfigs,
    ),
  );
  return isCovered ? 'valid' : 'invalid';
};
