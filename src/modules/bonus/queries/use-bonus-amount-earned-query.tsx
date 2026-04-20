import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusAmountEarned} from '../api/api';
import {useIsBonusActiveForUser} from '../use-is-bonus-active';

export const getBonusAmountEarnedQueryKey = (
  userId: string | undefined,
  orderId: string | undefined,
) => {
  return ['bonusUserBalance', userId, orderId];
};

export const useBonusAmountEarnedQuery = (
  orderId: string | undefined,
  disabled: boolean = false,
) => {
  const {userId, authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';
  const isBonusActiveForUser = useIsBonusActiveForUser();

  return useQuery({
    queryKey: getBonusAmountEarnedQueryKey(userId, orderId),
    queryFn: () => getBonusAmountEarned(orderId),
    enabled:
      authStatus === 'authenticated' &&
      isBonusActiveForUser &&
      isLoggedIn &&
      !disabled,
  });
};
