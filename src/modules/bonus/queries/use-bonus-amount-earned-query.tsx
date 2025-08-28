import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusAmountEarned} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const getBonusAmountEarnedQueryKey = (
  userId: string | undefined,
  fareContractId: string | undefined,
) => {
  return ['bonusUserBalance', userId, fareContractId];
};

export const useBonusAmountEarnedQuery = (
  fareContractId: string | undefined,
  disabled: boolean = false,
) => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useQuery({
    queryKey: getBonusAmountEarnedQueryKey(userId, fareContractId),
    queryFn: () => getBonusAmountEarned(fareContractId),
    enabled:
      authStatus === 'authenticated' &&
      isBonusProgramEnabled &&
      isLoggedIn &&
      !disabled,
  });
};
