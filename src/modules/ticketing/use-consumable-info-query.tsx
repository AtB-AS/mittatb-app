import {useQuery} from '@tanstack/react-query';
import {getSchoolCarnetInfo} from './api';
import {FareContractType} from '@atb-as/utils';

export const useConsumableInfoQuery = (fareContract: FareContractType) => {
  return useQuery({
    queryKey: ['getConsumableInfo', fareContract.id],
    queryFn: () => getSchoolCarnetInfo(fareContract.id),
    enabled: fareContract.travelRights.some((tr) => tr.schoolName), // TODO: Improve logic
  });
};
