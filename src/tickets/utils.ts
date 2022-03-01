import {flatten, sumBy} from 'lodash';
import {
  CarnetTicketUsedAccess,
  PreactivatedSingleTicket,
  PreactivatedTicket,
} from '.';
import {
  FareContract,
  FareContractState,
  CarnetTicket,
  TravelRight,
} from './types';
import {TravelToken} from '@atb/mobile-token/types';

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

export function isPeriodTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedSingleTicket {
  return travelRight?.type === 'PreActivatedPeriodTicket';
}

export function isInspectable(
  travelRight: TravelRight,
  hasActiveTravelCard: boolean,
  mobileTokenEnabled: boolean,
  inspectableTravelToken?: TravelToken,
): boolean {
  if (mobileTokenEnabled) return inspectableTravelToken?.isThisDevice ?? false;
  else return !hasActiveTravelCard && isSingleTicket(travelRight);
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

function hasActiveOrUsableCarnetTicket(tickets: CarnetTicket[]): boolean {
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

export const filterExpiredFareContracts = (fareContracts: FareContract[]) => {
  const isRefunded = (f: FareContract) =>
    f.state === FareContractState.Refunded;
  const isExpiredOrRefunded = (f: FareContract) =>
    !isActiveFareContractNowOrCanBeUsed(f) || isRefunded(f);
  return fareContracts.filter(isExpiredOrRefunded);
};
