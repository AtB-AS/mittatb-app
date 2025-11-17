import {useQuery} from '@tanstack/react-query';
import {getSchoolCarnetInfo} from './api';
import {ValidityStatus} from '../fare-contracts/utils';
import {FareContractInfo} from '../fare-contracts';

export const SCHOOL_CARNET_QUERY_KEY = 'getSchoolCarnetInfo';

export const useSchoolCarnetInfoQuery = (
  fareContract: FareContractInfo,
  validityStatus: ValidityStatus,
) => {
  return useQuery({
    queryKey: [SCHOOL_CARNET_QUERY_KEY, fareContract.id, validityStatus],
    queryFn: () => getSchoolCarnetInfo(fareContract.id),
    enabled: fareContract.tickets.some((t) => t.schoolName),
  });
};
