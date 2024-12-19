import {flatten, sumBy, startCase} from 'lodash';
import {
  FareContract,
  FareContractState,
  CarnetTravelRight,
  TravelRight,
  CarnetTravelRightUsedAccess,
  Reservation,
  LastUsedAccessState,
  UsedAccessStatus,
  NormalTravelRight,
  PaymentType,
} from './types';

export function isCarnetTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is CarnetTravelRight {
  return !!travelRight && 'maximumNumberOfAccesses' in travelRight;
}

export function isCarnet(fareContract: FareContract): boolean {
  return fareContract.travelRights.some(isCarnetTravelRight);
}

export function isNormalTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is NormalTravelRight {
  return (
    !!travelRight &&
    'startDateTime' in travelRight &&
    !!travelRight.startDateTime
  );
}

function isOrWillBeActivatedFareContract(f: FareContract): boolean {
  return (
    f.state === FareContractState.Activated ||
    f.state === FareContractState.NotActivated
  );
}

export function hasValidRightNowTravelRight(
  travelRights: TravelRight[],
  now: number,
): boolean {
  return travelRights.some((travelRight) =>
    isValidRightNowTravelRight(travelRight, now),
  );
}

function isValidRightNowTravelRight(travelRight: TravelRight, now: number) {
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

  return hasValidRightNowTravelRight(f.travelRights, now);
}

export function willBeValidInTheFutureTravelRight(
  travelRight: NormalTravelRight,
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

export function hasValidRightNowCarnetTravelRight(
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

export function isValidRightNowOrCanBeUsedFareContract(
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
    !hasValidRightNowCarnetTravelRight(travelRights, now)
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
    .filter(isNormalTravelRight)
    .filter((tr) => willBeValidInTheFutureTravelRight(tr, now));
  return travelRights.length > 0;
}

export const filterActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return fareContracts.filter((f) =>
    isValidRightNowOrCanBeUsedFareContract(f, now),
  );
};

export const filterAndSortValidRightNowOrCanBeUsedFareContracts = (
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
    !isValidRightNowOrCanBeUsedFareContract(f, now) || isRefunded(f);
  return fareContracts.filter(isExpiredOrRefunded);
};

export const filterRejectedReservations = (reservations: Reservation[]) =>
  reservations.filter((f: Reservation) => f.paymentStatus === 'REJECT');

export const filterValidRightNowFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return fareContracts.filter((fc) => isValidRightNowFareContract(fc, now));
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

export function humanizePaymentType(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    case PaymentType.Amex:
      return 'American Express';
    default:
      return '';
  }
}

export function humanizePaymentTypeString(paymentType: string) {
  switch (paymentType.toLowerCase()) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'MasterCard';
    case 'vipps':
      return 'Vipps';
    case 'amex':
      return 'American Express';
    default:
      return startCase(paymentType);
  }
}
