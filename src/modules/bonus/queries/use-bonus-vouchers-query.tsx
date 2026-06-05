import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusVouchers} from '../api/api';
import {useIsBonusActiveForUser} from '../use-is-bonus-active-for-user';

export const getBonusVouchersQueryKey = (userId: string | undefined) => {
  return ['bonusVouchers', userId];
};

export const useBonusVouchersQuery = () => {
  const {userId, authStatus, authenticationType} = useAuthContext();
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const isEnabled =
    authStatus === 'authenticated' &&
    authenticationType === 'phone' &&
    isBonusActiveForUser;

  return useQuery({
    enabled: isEnabled,
    queryKey: getBonusVouchersQueryKey(userId),
    queryFn: getBonusVouchers,
  });
};
