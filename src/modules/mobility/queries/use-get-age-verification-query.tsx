import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getAgeVerification} from '@atb/api/identity';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export enum AgeVerificationEnum {
  LegalAge = 'legalAge',
  UnderAge = 'underAge',
  NotVerified = 'notVerified',
}

export const ageVerificationQueryKeyString = 'getAgeVerification';

export const getAgeVerificationQueryKey = (legalAge: number) => [
  ageVerificationQueryKeyString,
  legalAge,
];

export const useGetAgeVerificationQuery = (legalAge: number) => {
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  return useQuery({
    enabled: isShmoDeepIntegrationEnabled,
    queryKey: getAgeVerificationQueryKey(legalAge),
    queryFn: ({signal}) => getAgeVerification(legalAge, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
};
