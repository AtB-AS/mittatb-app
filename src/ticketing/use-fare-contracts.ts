import {isActiveFareContract} from './is-active-fare-contract';
import {isValidFareContract} from './is-valid-fare-contract';
import {useTicketingState} from '@atb/ticketing/TicketingContext';
import type {FareContract} from '@atb/ticketing/types';

type Status = 'active' | 'valid' | 'expired';

export const useFareContracts = (
  status: Status,
  now: number,
): FareContract[] => {
  const {fareContracts} = useTicketingState();
  switch (status) {
    case 'active':
      return fareContracts.filter((fc) => isActiveFareContract(fc, now));
    case 'valid':
      return fareContracts.filter((fc) => isValidFareContract(fc, now));
    case 'expired':
      return fareContracts.filter((fc) => !isActiveFareContract(fc, now));
  }
};
