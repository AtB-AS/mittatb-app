import {TripPattern} from '@atb/api/types/trips';
import {useAuthContext} from '@atb/modules/auth';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  isCanBeActivatedNowFareContract,
  useFareContracts,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {isDefined} from '@atb/utils/presence';
import {TripTicketCardMode} from './components/TripTicketCard';
import {
  canActivateCarnetForTrip,
  getFareZoneIdsPerStop,
  getValidityEndAtFirstBoarding,
  isFareContractApplicableToTrip,
} from './utils';

export type TripTicketCardState = {
  mode: TripTicketCardMode;
  /** When the longest lasting of the valid fare contracts stops being valid */
  validUntil?: Date;
};

/**
 * Which state the trip ticket card should have, based on the user's valid and
 * upcoming fare contracts that fit the trip:
 * - 'valid' when one of them is valid at the first boarding.
 * - 'activate' when none is, but the user can activate one of them, like a
 *   carnet or a ticket bought for later.
 * - 'invalid' otherwise.
 */
export const useTripTicketCardMode = (
  tripPattern: TripPattern,
  now: number,
): TripTicketCardState => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();
  const {fareZones, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {fareContracts} = useFareContracts({availability: 'available'}, now);

  const legs = tripPattern.legs;
  const fareZoneIdsPerStop = getFareZoneIdsPerStop(legs, fareZones);
  if (!fareZoneIdsPerStop) return {mode: 'invalid'};

  const applicableFareContracts = fareContracts.filter((fareContract) =>
    isFareContractApplicableToTrip(
      legs,
      fareZoneIdsPerStop,
      fareContract,
      preassignedFareProducts,
      fareProductTypeConfigs,
    ),
  );

  const validUntil = applicableFareContracts
    .map((fareContract) => getValidityEndAtFirstBoarding(legs, fareContract))
    .filter(isDefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  if (validUntil) return {mode: 'valid', validUntil};

  const canActivate = applicableFareContracts.some((fareContract) => {
    if (fareContract.customerAccountId !== currentUserId) return false;
    if (canActivateCarnetForTrip(legs, fareContract)) return true;

    const preassignedFareProduct = preassignedFareProducts.find(
      (product) => product.id === fareContract.travelRights[0]?.fareProductRef,
    );
    return (
      isActivateTicketNowEnabled &&
      isCanBeActivatedNowFareContract(
        fareContract,
        now,
        currentUserId,
        preassignedFareProduct?.isBookingEnabled,
      )
    );
  });
  return {mode: canActivate ? 'activate' : 'invalid'};
};
