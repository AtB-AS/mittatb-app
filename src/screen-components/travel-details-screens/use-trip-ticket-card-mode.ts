import {TripPattern} from '@atb/api/types/trips';
import {useAuthContext} from '@atb/modules/auth';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {currentAppAuthorityId} from '@atb/modules/operator-config';
import {
  isCanBeActivatedNowFareContract,
  useFareContracts,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {isDefined} from '@atb/utils/presence';
import {FareContractType, getAvailabilityStatus} from '@atb-as/utils';
import {TripTicketCardMode} from './components/TripTicketCard';
import {
  canActivateCarnetForTrip,
  getFareZoneIdsPerStop,
  getLastAlightingTime,
  getValidityEndAtFirstBoarding,
  hasLegsFromOtherAuthorities,
  isFareContractApplicableToTrip,
} from './utils';

export type TripTicketCardState = {
  mode: TripTicketCardMode;
  /** When the longest lasting of the valid fare contracts stops being valid */
  validUntil?: Date;
  /** Whether validUntil is before the last leg that needs a ticket arrives */
  expiresBeforeArrival?: boolean;
};

/**
 * Which state the trip ticket card should have, based on the user's fare
 * contracts that fit the trip:
 * - undefined, meaning no card, when the last leg that needs a ticket has
 *   arrived, since a ticket is no longer relevant then.
 * - 'valid' when one of them is valid at the first boarding, and still valid.
 * - undefined, meaning no card, when one of them was valid at the first
 *   boarding but has expired since. The trip has then started with a ticket,
 *   so we should not ask the user to buy one, and whether the ticket still
 *   covers the trip depends on rules we don't check.
 * - 'activate' when the user can activate one of them, like a carnet or a
 *   ticket bought for later.
 * - 'invalid' otherwise.
 */
export const useTripTicketCardMode = (
  tripPattern: TripPattern,
  now: number,
): TripTicketCardState | undefined => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();
  const {fareZones, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {fareContracts} = useFareContracts({availability: 'available'}, now);
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    now,
  );

  const legs = tripPattern.legs;
  const lastAlightingTime = getLastAlightingTime(legs);
  if (lastAlightingTime && lastAlightingTime.getTime() <= now) return undefined;
  if (hasLegsFromOtherAuthorities(legs, currentAppAuthorityId)) {
    return {mode: 'invalid'};
  }
  const fareZoneIdsPerStop = getFareZoneIdsPerStop(legs, fareZones);
  if (!fareZoneIdsPerStop) return {mode: 'invalid'};

  const isApplicable = (fareContract: FareContractType) =>
    isFareContractApplicableToTrip(
      legs,
      fareZoneIdsPerStop,
      fareContract,
      preassignedFareProducts,
      fareProductTypeConfigs,
    );
  const applicableFareContracts = fareContracts.filter(isApplicable);

  // A carnet can still be available when the access that was active at the
  // first boarding has expired, so validUntil can be in the past.
  const validUntil = applicableFareContracts
    .map((fareContract) => getValidityEndAtFirstBoarding(legs, fareContract))
    .filter(isDefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  if (validUntil && validUntil.getTime() > now) {
    return {
      mode: 'valid',
      validUntil,
      expiresBeforeArrival:
        !!lastAlightingTime && validUntil < lastAlightingTime,
    };
  }

  // Sent fare contracts are not in this list, but received ones are. Only
  // count the user's own to be explicit about it.
  const wasValidAtFirstBoarding =
    !!validUntil ||
    historicalFareContracts.some((fareContract) => {
      if (fareContract.customerAccountId !== currentUserId) return false;
      const {status} = getAvailabilityStatus(fareContract, now);
      if (status !== 'expired' && status !== 'empty') return false;
      return (
        isApplicable(fareContract) &&
        !!getValidityEndAtFirstBoarding(legs, fareContract)
      );
    });
  if (wasValidAtFirstBoarding) return undefined;

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
