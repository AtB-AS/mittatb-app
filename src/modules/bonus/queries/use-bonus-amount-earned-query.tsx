import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusAmountEarned} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const getBonusAmountEarnedQueryKey = (
  userId: string | undefined,
  isBonusProgramEnabled: boolean,
  isLoggedIn: boolean,
  fareContractId: string | undefined,
  disabled: boolean,
) => {
  return [
    'bonusUserBalance',
    userId,
    isBonusProgramEnabled,
    isLoggedIn,
    fareContractId,
    disabled,
  ];
};

export const useBonusAmountEarnedQuery = (
  fareContractId: string | undefined,
  disabled: boolean,
) => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useQuery({
    queryKey: getBonusAmountEarnedQueryKey(
      userId,
      isBonusProgramEnabled,
      isLoggedIn,
      fareContractId,
      disabled,
    ),
    queryFn: () =>
      getBonusAmountEarned(
        isLoggedIn,
        isBonusProgramEnabled,
        fareContractId,
        disabled,
      ),
    retry: 3,
    retryDelay: 500,
    enabled: authStatus === 'authenticated' && isBonusProgramEnabled,
  });
};
