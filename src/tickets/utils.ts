import {
  FareContract,
  FareContractState,
  PreactivatedTicket,
  TravelRight,
} from './types';

export function isPreactivatedTicket(
  travelRight: TravelRight | undefined,
): travelRight is PreactivatedTicket {
  return (
    travelRight?.type === 'PreActivatedSingleTicket' ||
    travelRight?.type === 'PreActivatedPeriodTicket'
  );
}

export const filterActiveFareContracts = (fareContracts: FareContract[]) => {
  const isValidNow = (f: FareContract): boolean => {
    const firstTravelRight = f.travelRights?.[0];
    if (isPreactivatedTicket(firstTravelRight)) {
      return firstTravelRight.endDateTime.toMillis() > Date.now();
    }
    return false;
  };
  const isActivated = (f: FareContract) =>
    f.state === FareContractState.Activated;
  return fareContracts.filter(isValidNow).filter(isActivated);
};

export const filterExpiredFareContracts = (fareContracts: FareContract[]) => {
  const isExpired = (f: FareContract): boolean => {
    const firstTravelRight = f.travelRights?.[0];
    if (isPreactivatedTicket(firstTravelRight)) {
      return !(firstTravelRight.endDateTime.toMillis() > Date.now());
    }
    return false;
  };
  const isRefunded = (f: FareContract) =>
    f.state === FareContractState.Refunded;
  const isExpiredOrRefunded = (f: FareContract) =>
    isExpired(f) || isRefunded(f);
  return fareContracts.filter(isExpiredOrRefunded);
};
