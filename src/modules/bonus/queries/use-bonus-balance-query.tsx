import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusBalance} from '../api/api';
import {useIsEnrolled, ProgramId} from '@atb/modules/enrollment';

export const getBonusBalanceQueryKey = (userId: string | undefined) => {
  return ['bonusUserBalance', userId];
};

export const useBonusBalanceQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isBonusEnabled = useIsEnrolled(ProgramId.BONUS);
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
