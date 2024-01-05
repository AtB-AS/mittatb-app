import {getLastUsedAccess} from '@atb/fare-contracts';
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

export function isCarnetTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is CarnetTravelRight {
  return travelRight?.type === 'CarnetTicket';
}

export function isPreActivatedTravelRight(
  travelRight: TravelRight | undefined,
): travelRight is PreActivatedTravelRight {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket' ||
    travelRight?.type === 'NightTicket' ||
    travelRight?.type === 'SingleBoatTicket' ||
    travelRight?.type === 'PeriodBoatTicket'
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
  return travelRight.endDateTime.toMillis() > now;
}

function hasValidCarnetTravelRight(
  travelRights: CarnetTravelRight[],
  now: number,
): boolean {
  const {usedAccesses} = flattenCarnetTravelRightAccesses(travelRights);
  const [lastUsedAccess] = usedAccesses?.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.toMillis() ?? 0;
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

export function hasActiveOrUsableCarnetTravelRight(
  travelRights: CarnetTravelRight[],
): boolean {
  const [firstTravelRight] = travelRights;
  const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTravelRightAccesses(travelRights);

  const [lastUsedAccess] = usedAccesses?.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.toMillis() ?? 0;
  const now = Date.now();

  return (
    now < validTo ||
    (firstTravelRight.endDateTime.toMillis() > now &&
      maximumNumberOfAccesses > numberOfUsedAccesses)
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
    (a, b) => a.startDateTime.toMillis() - b.startDateTime.toMillis(),
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

function isActiveFareContractNowOrCanBeUsed(
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
    return hasActiveOrUsableCarnetTravelRight(
      f.travelRights.filter(isCarnetTravelRight),
    );
  }

  return false;
}

export const filterActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
  now: number,
) => {
  return fareContracts.filter((f) =>
    isActiveFareContractNowOrCanBeUsed(f, now),
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
    !isActiveFareContractNowOrCanBeUsed(f, now) || isRefunded(f);
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
        now >= firstTravelRight.startDateTime.toMillis() &&
        now <= firstTravelRight.endDateTime.toMillis()
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
