import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusBalance} from '../api/api';
import {useIsBonusActiveForUser} from '../use-is-bonus-active-for-user';

export const getBonusBalanceQueryKey = (userId: string | undefined) => {
  return ['bonusUserBalance', userId];
};

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const isEnabled =
    authStatus === 'authenticated' &&
    authenticationType === 'phone' &&
    isBonusActiveForUser;

  return useQuery({
    enabled: isEnabled,
    queryKey: getBonusBalanceQueryKey(userId),
    queryFn: getBonusBalance,
    placeholderData: 0,
  });
};
