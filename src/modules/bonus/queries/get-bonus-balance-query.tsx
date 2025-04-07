import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {getBonusBalance} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useQuery({
    queryKey: ['bonusUserBalance', userId, isLoggedIn],
    queryFn: () => getBonusBalance(isLoggedIn),
    enabled: authStatus === 'authenticated' && isBonusProgramEnabled,
  });
};
