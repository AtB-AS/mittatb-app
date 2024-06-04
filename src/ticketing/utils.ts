import {flatten, sumBy} from 'lodash';
import {
  FareContract,
  FareContractState,
  CarnetTravelRight,
  TravelRight,
  PreActivatedTravelRight,
  CarnetTravelRightUsedAccess,
  Reservation,
  LastUsedAccessState,
  UsedAccessStatus,
  NormalTravelRight,
} from './types';

export function isCarnetTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is CarnetTravelRight {
  return !!travelRight && 'maximumNumberOfAccesses' in travelRight;
}

export function isCarnet(fareContract: FareContract): boolean {
  return fareContract.travelRights.some(isCarnetTravelRight);
}

export function isPreActivatedTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is PreActivatedTravelRight {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket' ||
    travelRight?.type === 'NightTicket' ||
    travelRight?.type === 'SingleBoatTicket' ||
    travelRight?.type === 'PeriodBoatTicket' ||
    travelRight?.type === 'YouthTicket'
  );
}

export function isNormalTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is NormalTravelRight {
  return !!travelRight && 'startDateTime' in travelRight;
}

function isOrWillBeActivatedFareContract(f: FareContract): boolean {
  return (
    f.state === FareContractState.Activated ||
    f.state === FareContractState.NotActivated
  );
}

export function hasActiveTravelRight(
  travelRights: TravelRight[],
  now: number,
): boolean {
  return travelRights.some((travelRight) =>
    isActiveTravelRight(travelRight, now),
  );
}

function isActiveTravelRight(travelRight: TravelRight, now: number) {
  // Unknown travel rights are not active
  if (!isNormalTravelRight(travelRight)) return false;

  if (isCarnetTravelRight(travelRight)) {
    const {validFrom, validTo} = getLastUsedAccess(
      now,
      travelRight.usedAccesses,
    );

    // If there are no used accesses, the travel right is not active
    if (!validTo || !validFrom) return false;

    // If the last used access is not active, the travel right is not active.
    if (validTo < now) return false;
    if (validFrom > now) return false;
  }

  if (travelRight.endDateTime.getTime() < now) return false;
  if (travelRight.startDateTime.getTime() > now) return false;

  return true;
}

export function isValidRightNowFareContract(
  f: FareContract,
  now: number,
): boolean {
  if (!isOrWillBeActivatedFareContract(f)) {
    return false;
  }

  return hasActiveTravelRight(f.travelRights, now);
}

export function willBeValidInTheFutureTravelRight(
  travelRight: PreActivatedTravelRight,
  now: number,
): boolean {
  return travelRight.startDateTime.getTime() > now;
}

export function isSentOrReceivedFareContract(fc: FareContract) {
  return fc.customerAccountId !== fc.purchasedBy;
}

export function hasUsableCarnetTravelRight(
  travelRights: CarnetTravelRight[],
  now: number,
) {
  // Travel right has not expired
  if (
    travelRights.some((travelRight) => now > travelRight.endDateTime.getTime())
  )
    return false;

  // There are remaining accesses
  const {maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTravelRightAccesses(travelRights);
  if (maximumNumberOfAccesses <= numberOfUsedAccesses) return false;

  return true;
}

export function hasActiveCarnetTravelRight(
  travelRights: CarnetTravelRight[],
  now: number,
) {
  // Some travel right have some active access
  return travelRights.some((travelRight) =>
    travelRight.usedAccesses.some(
      (access) =>
        now > access.startDateTime.getTime() &&
        now < access.endDateTime.getTime(),
    ),
  );
}

type FlattenedCarnetTravelRights = {
  usedAccesses: CarnetTravelRightUsedAccess[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

export function flattenCarnetTravelRightAccesses(
  travelRights: CarnetTravelRight[],
): FlattenedCarnetTravelRights {
  const allUsedAccesses = travelRights.map((t) => t.usedAccesses ?? []);
  const usedAccesses = flatten(allUsedAccesses).sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime(),
  );
  const maximumNumberOfAccesses = sumBy(
    travelRights,
    (t) => t.maximumNumberOfAccesses,
  );
  const numberOfUsedAccesses = sumBy(
    travelRights,
    (t) => t.numberOfUsedAccesses,
  );
  return {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

export function isActiveNowOrCanBeUsedFareContract(
  f: FareContract,
  now: number,
) {
  if (!isOrWillBeActivatedFareContract(f)) return false;
  if (isValidRightNowFareContract(f, now)) return true;

  if (
    hasUsableCarnetTravelRight(f.travelRights.filter(isCarnetTravelRight), now)
  )
    return true;

  return f.travelRights
    .filter(isNormalTravelRight)
    .some((travelright) => willBeValidInTheFutureTravelRight(travelright, now));
}

export function isCanBeConsumedNowFareContract(
  f: FareContract,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;
  if (!isOrWillBeActivatedFareContract(f)) return false;
  if (!isCarnet(f)) return false;
  const travelRights = f.travelRights.filter(isCarnetTravelRight);

  return (
    hasUsableCarnetTravelRight(travelRights, now) &&
    !hasActiveCarnetTravelRight(travelRights, now)
  );
}

export function isCanBeActivatedNowFareContract(
  f: FareContract,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;
  if (!isOrWillBeActivatedFareContract(f)) return false;
  if (isCarnet(f)) return false;
  const travelRights = f.travelRights
    .filter(isPreActivatedTravelRight)
    .filter((tr) => willBeValidInTheFutureTravelRight(tr, now));
  return travelRights.length > 0;
}

export const filterActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return fareContracts.filter((f) =>
    isActiveNowOrCanBeUsedFareContract(f, now),
  );
};

export const filterAndSortActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return filterActiveOrCanBeUsedFareContracts(fareContracts, now).sort(
    function (a, b): number {
      const isA = isValidRightNowFareContract(a, now);
      const isB = isValidRightNowFareContract(b, now);

      if (isA === isB) return 0;
      if (isA) return -1;
      return 1;
    },
  );
};

export const filterExpiredFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  const isRefunded = (f: FareContract) =>
    f.state === FareContractState.Refunded;
  const isExpiredOrRefunded = (f: FareContract) =>
    !isActiveNowOrCanBeUsedFareContract(f, now) || isRefunded(f);
  return fareContracts.filter(isExpiredOrRefunded);
};

export const filterRejectedReservations = (reservations: Reservation[]) =>
  reservations.filter((f: Reservation) => f.paymentStatus === 'REJECT');

export const filterValidRightNowFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return fareContracts.filter((f: FareContract): boolean => {
    if (f.state !== FareContractState.Activated) return false;

    const travelRights = f.travelRights;
    if (travelRights.length < 1) return false;

    const firstTravelRight = travelRights?.[0];

    const carnetTravelRights = travelRights.filter(isCarnetTravelRight);
    if (carnetTravelRights.length > 0) {
      const {usedAccesses} =
        flattenCarnetTravelRightAccesses(carnetTravelRights);

      const {status: usedAccessValidityStatus} = getLastUsedAccess(
        now,
        usedAccesses,
      );

      if (usedAccessValidityStatus === 'valid') {
        return true;
      }

      return false;
    }

    if (isPreActivatedTravelRight(firstTravelRight)) {
      return (
        now >= firstTravelRight.startDateTime.getTime() &&
        now <= firstTravelRight.endDateTime.getTime()
      );
    }

    return false;
  });
};

export function getLastUsedAccess(
  now: number,
  usedAccesses: CarnetTravelRightUsedAccess[],
): LastUsedAccessState {
  const lastUsedAccess = usedAccesses.slice(-1).pop();

  let status: UsedAccessStatus = 'inactive';
  let validFrom: number | undefined = undefined;
  let validTo: number | undefined = undefined;

  if (lastUsedAccess) {
    validFrom = lastUsedAccess.startDateTime.getTime();
    validTo = lastUsedAccess.endDateTime.getTime();
    status = getUsedAccessValidity(now, validFrom, validTo);
  }

  return {status, validFrom, validTo};
}
function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}
