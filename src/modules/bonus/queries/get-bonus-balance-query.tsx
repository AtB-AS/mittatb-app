import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {getBonusBalance} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();

  return useQuery({
    queryKey: ['bonusUserBalance', userId],
    queryFn: getBonusBalance,
    enabled: authStatus === 'authenticated' && isBonusProgramEnabled,
  });
};
