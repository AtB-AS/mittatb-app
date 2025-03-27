import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {getBonusBalance} from '../api/api';

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    queryKey: ['bonusUserBalance', userId],
    queryFn: getBonusBalance,
    enabled: authStatus === 'authenticated',
  });
};
