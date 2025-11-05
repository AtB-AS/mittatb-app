import {useQuery} from '@tanstack/react-query';
import {getSchoolCarnetInfo} from './api';
import {FareContractType} from '@atb-as/utils';
import {ValidityStatus} from '../fare-contracts/utils';

export const SCHOOL_CARNET_QUERY_KEY = 'getSchoolCarnetInfo';

export const useSchoolCarnetInfoQuery = (
  fareContract: FareContractType,
  validityStatus: ValidityStatus,
) => {
  return useQuery({
    queryKey: [SCHOOL_CARNET_QUERY_KEY, fareContract.id, validityStatus],
    queryFn: () => getSchoolCarnetInfo(fareContract.id),
    enabled: fareContract.travelRights.some((tr) => tr.schoolName),
  });
};
