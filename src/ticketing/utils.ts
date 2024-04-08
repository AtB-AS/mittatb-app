import {flatten, sumBy} from 'lodash';
import {
  CarnetTravelRightUsedAccess,
  PreActivatedSingleTravelRight,
  PreActivatedTravelRight,
  Reservation,
} from '.';
import {
  FareContract,
  FareContractState,
  CarnetTravelRight,
  TravelRight,
} from './types';
import {WebViewNavigation} from 'react-native-webview/lib/WebViewTypes';
import {parse as parseURL} from 'search-params';
import {getLastUsedAccess} from '@atb/fare-contracts/utils';

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

export function isSingleTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is PreActivatedSingleTravelRight {
  return travelRight?.type === 'PreActivatedSingleTicket';
}

function isOrWillBeActivatedFareContract(f: FareContract): boolean {
  return (
    f.state === FareContractState.Activated ||
    f.state === FareContractState.NotActivated
  );
}

function isValidPreActivatedTravelRight(
  travelRight: PreActivatedTravelRight,
  now: number,
): boolean {
  return travelRight.endDateTime.getTime() > now;
}

function hasValidCarnetTravelRight(
  travelRights: CarnetTravelRight[],
  now: number,
): boolean {
  const {usedAccesses} = flattenCarnetTravelRightAccesses(travelRights);
  const [lastUsedAccess] = usedAccesses?.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.getTime() ?? 0;
  return now < validTo;
}

export function isValidRightNowFareContract(
  f: FareContract,
  now: number,
): boolean {
  if (!isOrWillBeActivatedFareContract(f)) {
    return false;
  }

  const firstTravelRight = f.travelRights?.[0];
  if (isPreActivatedTravelRight(firstTravelRight)) {
    return isValidPreActivatedTravelRight(firstTravelRight, now);
  } else if (isCarnetTravelRight(firstTravelRight)) {
    return hasValidCarnetTravelRight(
      f.travelRights.filter(isCarnetTravelRight),
      now,
    );
  }

  return false;
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

function isActiveNowOrCanBeUsedFareContract(f: FareContract, now: number) {
  if (!isOrWillBeActivatedFareContract(f)) {
    return false;
  }

  const firstTravelRight = f.travelRights?.[0];
  if (isPreActivatedTravelRight(firstTravelRight)) {
    return isValidPreActivatedTravelRight(firstTravelRight, now);
  } else if (isCarnetTravelRight(firstTravelRight)) {
    const travelRights = f.travelRights.filter(isCarnetTravelRight);
    return (
      hasActiveCarnetTravelRight(travelRights, now) ||
      hasUsableCarnetTravelRight(travelRights, now)
    );
  }

  return false;
}

export function isCanBeConsumedNowFareContract(
  f: FareContract,
  now: number,
  currentUserId: string | undefined,
) {
  if (f.customerAccountId !== currentUserId) return false;
  if (!isCarnet(f)) return false;
  const travelRights = f.travelRights.filter(isCarnetTravelRight);

  // @TODO: This is a temporary limitation because of issues with consumption of
  // carnets with more than one travel right. Should be removed once there is a
  // solution for this in the backend.
  if (travelRights.length > 1) return false;

  return (
    hasUsableCarnetTravelRight(travelRights, now) &&
    !hasActiveCarnetTravelRight(travelRights, now)
  );
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

/**
 * Get response code from query param. iOS uses 'responseCode' and Android
 * uses 'response_code'.
 */
export function getResponseCode(event: WebViewNavigation) {
  const params = parseURL(event.url);
  return params['responseCode'] ?? params['response_code'];
}
