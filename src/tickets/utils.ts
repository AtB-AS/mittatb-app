import {getLastUsedAccess} from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetails';
import {flatten, sumBy} from 'lodash';
import {
  CarnetTicketUsedAccess,
  PreactivatedSingleTicket,
  PreactivatedTicket,
  Reservation,
} from '.';
import {
  FareContract,
  FareContractState,
  CarnetTicket,
  TravelRight,
} from './types';

export function isCarnetTicket(
  travelRight: TravelRight | undefined,
): travelRight is CarnetTicket {
  return travelRight?.type === 'CarnetTicket';
}

export function isPreactivatedTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedTicket {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket'
  );
}

export function isSingleTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedSingleTicket {
  return travelRight?.type === 'PreActivatedSingleTicket';
}

export function isInspectableTicket(
  travelRight: TravelRight,
  hasActiveTravelCard: boolean,
  mobileTokenEnabled: boolean,
  deviceIsInspectable: boolean,
  mobileTokenError: boolean,
  fallbackEnabled: boolean,
): boolean {
  if (mobileTokenEnabled) {
    return deviceIsInspectable || (mobileTokenError && fallbackEnabled);
  } else return !hasActiveTravelCard && isSingleTicket(travelRight);
}

function isOrWillBeActivatedFareContract(f: FareContract): boolean {
  return (
    f.state === FareContractState.Activated ||
    f.state === FareContractState.NotActivated
  );
}

function isValidPreactivatedTicket(ticket: PreactivatedTicket): boolean {
  return ticket.endDateTime.toMillis() > Date.now();
}

function hasValidCarnetTicket(tickets: CarnetTicket[]): boolean {
  const {usedAccesses} = flattenCarnetTicketAccesses(tickets);
  const [lastUsedAccess] = usedAccesses?.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.toMillis() ?? 0;
  return Date.now() < validTo;
}

export function isValidRightNowFareContract(f: FareContract): boolean {
  if (!isOrWillBeActivatedFareContract(f)) {
    return false;
  }

  const firstTravelRight = f.travelRights?.[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    return isValidPreactivatedTicket(firstTravelRight);
  } else if (isCarnetTicket(firstTravelRight)) {
    return hasValidCarnetTicket(f.travelRights.filter(isCarnetTicket));
  }

  return false;
}

export function hasActiveOrUsableCarnetTicket(
  tickets: CarnetTicket[],
): boolean {
  const [firstTicket] = tickets;
  const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTicketAccesses(tickets);

  const [lastUsedAccess] = usedAccesses?.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.toMillis() ?? 0;
  const now = Date.now();

  return (
    now < validTo ||
    (firstTicket.endDateTime.toMillis() > now &&
      maximumNumberOfAccesses > numberOfUsedAccesses)
  );
}

type FlattenedCarnetTicket = {
  usedAccesses: CarnetTicketUsedAccess[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

export function flattenCarnetTicketAccesses(
  tickets: CarnetTicket[],
): FlattenedCarnetTicket {
  const allUsedAccesses = tickets.map((t) => t.usedAccesses ?? []);
  const usedAccesses = flatten(allUsedAccesses).sort(
    (a, b) => a.startDateTime.toMillis() - b.startDateTime.toMillis(),
  );
  const maximumNumberOfAccesses = sumBy(
    tickets,
    (t) => t.maximumNumberOfAccesses,
  );
  const numberOfUsedAccesses = sumBy(tickets, (t) => t.numberOfUsedAccesses);
  return {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

function isActiveFareContractNowOrCanBeUsed(f: FareContract): boolean {
  if (!isOrWillBeActivatedFareContract(f)) {
    return false;
  }

  const firstTravelRight = f.travelRights?.[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    return isValidPreactivatedTicket(firstTravelRight);
  } else if (isCarnetTicket(firstTravelRight)) {
    return hasActiveOrUsableCarnetTicket(f.travelRights.filter(isCarnetTicket));
  }

  return false;
}

export const filterActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
) => {
  return fareContracts.filter(isActiveFareContractNowOrCanBeUsed);
};

export const filterAndSortActiveOrCanBeUsedFareContracts = (
  fareContracts: FareContract[],
) => {
  return filterActiveOrCanBeUsedFareContracts(fareContracts).sort(function (
    a,
    b,
  ): number {
    const isA = isValidRightNowFareContract(a);
    const isB = isValidRightNowFareContract(b);

    if (isA === isB) return 0;
    if (isA) return -1;
    return 1;
  });
};

export const filterExpiredFareContracts = (fareContracts: FareContract[]) => {
  const isRefunded = (f: FareContract) =>
    f.state === FareContractState.Refunded;
  const isExpiredOrRefunded = (f: FareContract) =>
    !isActiveFareContractNowOrCanBeUsed(f) || isRefunded(f);
  return fareContracts.filter(isExpiredOrRefunded);
};

export const filterRejectedReservations = (reservations: Reservation[]) =>
  reservations.filter((f: Reservation) => f.paymentStatus === 'REJECT');

export const filterValidRightNowFareContract = (
  fareContracts: FareContract[],
) => {
  return fareContracts.filter((f: FareContract): boolean => {
    if (f.state !== FareContractState.Activated) return false;

    const travelRights = f.travelRights;
    if (travelRights.length < 1) return false;

    const now = Date.now();
    const firstTravelRight = travelRights?.[0];

    const carnetTravelRights = travelRights.filter(isCarnetTicket);
    if (carnetTravelRights.length > 0) {
      const {usedAccesses} = flattenCarnetTicketAccesses(carnetTravelRights);

      const {status: usedAccessValidityStatus} = getLastUsedAccess(
        now,
        usedAccesses,
      );

      if (usedAccessValidityStatus === 'valid') {
        return true;
      }

      return false;
    }

    if (isPreactivatedTicket(firstTravelRight)) {
      return (
        now >= firstTravelRight.startDateTime.toMillis() &&
        now <= firstTravelRight.endDateTime.toMillis()
      );
    }

    return false;
  });
};
