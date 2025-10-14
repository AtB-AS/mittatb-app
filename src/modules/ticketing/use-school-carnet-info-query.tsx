import {useQuery} from '@tanstack/react-query';
import {getSchoolCarnetInfo} from './api';
import {FareContractType} from '@atb-as/utils';

export const useSchoolCarnetInfoQuery = (fareContract: FareContractType) => {
  return useQuery({
    queryKey: ['getSchoolCarnetInfo', fareContract.id],
    queryFn: () => getSchoolCarnetInfo(fareContract.id),
    enabled: fareContract.travelRights.some((tr) => tr.schoolName),
  });
};
