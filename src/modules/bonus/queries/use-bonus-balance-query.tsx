import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusBalance} from '../api/api';
import {useIsEnrolled, KnownProgramId} from '@atb/modules/enrollment';

export const getBonusBalanceQueryKey = (userId: string | undefined) => {
  return ['bonusUserBalance', userId];
};

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isBonusEnabled = useIsEnrolled(KnownProgramId.BONUS);
  const isEnabled =
    authStatus === 'authenticated' &&
    authenticationType === 'phone' &&
    isBonusEnabled;

  return useQuery({
    enabled: isEnabled,
    queryKey: getBonusBalanceQueryKey(userId),
    queryFn: getBonusBalance,
    placeholderData: 0,
  });
};
