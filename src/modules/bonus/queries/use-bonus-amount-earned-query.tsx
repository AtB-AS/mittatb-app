import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {getBonusAmountEarned} from '../api/api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useBonusAmountEarnedQuery = (
  fareContractId: string | undefined,
  disabled: boolean = false,
) => {
  const {userId, authStatus} = useAuthContext();
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useQuery({
    queryKey: ['bonusUserBalance', userId, fareContractId],
    queryFn: () => getBonusAmountEarned(fareContractId),
    retry: 3,
    enabled:
      authStatus === 'authenticated' &&
      isBonusProgramEnabled &&
      isLoggedIn &&
      !disabled,
  });
};
