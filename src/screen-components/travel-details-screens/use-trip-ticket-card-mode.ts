import {Leg, TripPattern} from '@atb/api/types/trips';
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
  getFirstBoardingTime,
  getLastAlightingTime,
  getRemainingLegs,
  getValidityEndAtFirstBoarding,
  hasLegsFromOtherAuthorities,
  isFareContractApplicableToTrip,
} from './utils';

export type TripTicketCardState = {
  mode: TripTicketCardMode;
  /**
   * For 'valid': when the longest lasting of the valid fare contracts stops
   * being valid. For 'expired': when the fare contract the trip started with
   * stops, or stopped, being valid.
   */
  validUntil?: Date;
  /** Whether validUntil is before the last leg that needs a ticket arrives */
  expiresBeforeArrival?: boolean;
};

/**
 * Which state the trip ticket card should have, based on the user's fare
 * contracts. Once the trip has started, only the remaining part of it from the
 * next boarding is considered, see `getRemainingLegs`.
 * - undefined, meaning no card, when the last leg that needs a ticket has
 *   arrived, since a ticket is no longer relevant then.
 * - 'valid' when a fare contract that fits the remaining trip is valid at the
 *   next boarding, and still valid.
 * - 'activate' when the user can activate a fare contract for the remaining
 *   trip, like a carnet or a ticket bought for later. This goes before
 *   'expired', since activating is better than buying a new ticket.
 * - 'expired' when the trip started with a fare contract that is not valid at
 *   the next boarding. We don't decide whether a new ticket is needed, since
 *   that depends on validity rules we don't check.
 * - undefined when the trip started with a fare contract that has expired
 *   since, and there is no boarding left, so there is nothing to do.
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

  const tripLegs = tripPattern.legs;
  const lastAlightingTime = getLastAlightingTime(tripLegs);
  if (lastAlightingTime && lastAlightingTime.getTime() <= now) return undefined;

  const firstBoardingTime = getFirstBoardingTime(tripLegs);
  const hasStarted =
    firstBoardingTime !== undefined && firstBoardingTime <= now;
  const legs = getRemainingLegs(tripLegs, now);
  const nextBoardingTime = getFirstBoardingTime(legs);
  const hasBoardingLeft =
    nextBoardingTime !== undefined && nextBoardingTime > now;

  const getApplicableFareContracts = (
    legsToCover: Leg[],
    candidates: FareContractType[],
  ) => {
    if (hasLegsFromOtherAuthorities(legsToCover, currentAppAuthorityId)) {
      return [];
    }
    const fareZoneIdsPerStop = getFareZoneIdsPerStop(legsToCover, fareZones);
    if (!fareZoneIdsPerStop) return [];
    return candidates.filter((fareContract) =>
      isFareContractApplicableToTrip(
        legsToCover,
        fareZoneIdsPerStop,
        fareContract,
        preassignedFareProducts,
        fareProductTypeConfigs,
      ),
    );
  };
  const getLatestValidityEnd = (
    legsToCover: Leg[],
    candidates: FareContractType[],
  ) =>
    candidates
      .map((fareContract) =>
        getValidityEndAtFirstBoarding(legsToCover, fareContract),
      )
      .filter(isDefined)
      .sort((a, b) => b.getTime() - a.getTime())[0];

  if (
    hasLegsFromOtherAuthorities(legs, currentAppAuthorityId) ||
    !getFareZoneIdsPerStop(legs, fareZones)
  ) {
    return {mode: 'invalid'};
  }
  const applicableFareContracts = getApplicableFareContracts(
    legs,
    fareContracts,
  );

  // A carnet can still be available when the access that was active at the
  // next boarding has expired, so validUntil can be in the past.
  const validUntil = getLatestValidityEnd(legs, applicableFareContracts);
  if (validUntil && validUntil.getTime() > now) {
    return {
      mode: 'valid',
      validUntil,
      expiresBeforeArrival:
        !!lastAlightingTime && validUntil < lastAlightingTime,
    };
  }
  if (validUntil) return undefined;

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
  if (canActivate) return {mode: 'activate'};

  if (hasStarted) {
    // Sent fare contracts are not in these lists, but received ones are. Only
    // count the user's own to be explicit about it.
    const ownFareContracts = [
      ...fareContracts,
      ...historicalFareContracts.filter((fareContract) => {
        const {status} = getAvailabilityStatus(fareContract, now);
        return status === 'expired' || status === 'empty';
      }),
    ].filter(
      (fareContract) => fareContract.customerAccountId === currentUserId,
    );
    const startedWithValidUntil = getLatestValidityEnd(
      tripLegs,
      getApplicableFareContracts(tripLegs, ownFareContracts),
    );
    if (startedWithValidUntil) {
      return hasBoardingLeft
        ? {mode: 'expired', validUntil: startedWithValidUntil}
        : undefined;
    }
  }

  return {mode: 'invalid'};
};
