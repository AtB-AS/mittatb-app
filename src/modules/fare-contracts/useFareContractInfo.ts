import {
  FareContractType,
  getAccesses,
  TravelRightType,
  UsedAccessType,
} from '@atb-as/utils';
import {
  getLastUsedAccess,
  isSentOrReceivedFareContract,
} from '@atb/modules/ticketing';
import {useAuthContext} from '@atb/modules/auth';
import {getValidityStatus} from './utils';
import type {ValidityStatus} from './utils';

type FareContractInfoProps = {
  travelRights: TravelRightType[];
  validityStatus: ValidityStatus;
  validFrom: number;
  validTo: number;
  usedAccesses?: UsedAccessType[];
  maximumNumberOfAccesses?: number;
  numberOfUsedAccesses?: number;
  datedServiceJourneyRef?: string;
};

export function useFareContractInfo({
  fc,
  now,
}: {
  fc: FareContractType;
  now: number;
}): FareContractInfoProps {
  const {abtCustomerId: currentUserId} = useAuthContext();

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const travelRights = fc.travelRights;
  const firstTravelRight = travelRights?.[0];

  const fareContractValidFrom = firstTravelRight.startDateTime.getTime();
  const fareContractValidTo = firstTravelRight.endDateTime.getTime();

  const validityStatus = getValidityStatus(now, fc, isSent);

  const carnetTravelRightAccesses = getAccesses(fc);

  const lastUsedAccess =
    carnetTravelRightAccesses &&
    getLastUsedAccess(now, carnetTravelRightAccesses.usedAccesses);

  const validFrom = lastUsedAccess?.validFrom
    ? lastUsedAccess.validFrom
    : fareContractValidFrom;
  const validTo = lastUsedAccess?.validTo
    ? lastUsedAccess.validTo
    : fareContractValidTo;

  const usedAccesses = carnetTravelRightAccesses?.usedAccesses;
  const maximumNumberOfAccesses =
    carnetTravelRightAccesses?.maximumNumberOfAccesses;
  const numberOfUsedAccesses = carnetTravelRightAccesses?.numberOfUsedAccesses;

  return {
    travelRights,
    validityStatus,
    validFrom,
    validTo,
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}
