import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusBalance} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const getBonusBalanceQueryKey = (userId: string | undefined) => {
  return ['bonusUserBalance', userId];
};

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isEnabled =
    authStatus === 'authenticated' &&
    authenticationType === 'phone' &&
    isBonusProgramEnabled;

  return useQuery({
    enabled: isEnabled,
    queryKey: getBonusBalanceQueryKey(userId),
    queryFn: getBonusBalance,
    placeholderData: 0,
  });
};
