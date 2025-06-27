import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getAgeVerification} from '@atb/api/vipps-login/api';

export enum AgeVerificationEnum {
  LegalAge = 'legalAge',
  UnderAge = 'underAge',
  NotVerified = 'notVerified',
}

export const getAgeVerificationQueryKey = (legalAge: number) => [
  'getAgeVerification',
  legalAge,
];

export const useGetAgeVerificationQuery = (legalAge: number) =>
  useQuery({
    queryKey: getAgeVerificationQueryKey(legalAge),
    queryFn: ({signal}) => getAgeVerification(legalAge, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
