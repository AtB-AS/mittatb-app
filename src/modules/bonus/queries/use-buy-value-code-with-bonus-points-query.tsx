import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {buyValueCodeWithBonusPoints} from '../api/api';
import {getBonusBalanceQueryKey} from './get-bonus-balance-query';

export const useBuyValueCodeWithBonusPointsMutation = (
  bonusProductId: string | undefined,
) => {
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useMutation({
    mutationKey: ['bonusValueCode', userId, bonusProductId],
    mutationFn: () => buyValueCodeWithBonusPoints(bonusProductId),
    onSuccess: () =>
      queryClient.invalidateQueries(
        getBonusBalanceQueryKey(userId, isLoggedIn),
      ),
  });
};
