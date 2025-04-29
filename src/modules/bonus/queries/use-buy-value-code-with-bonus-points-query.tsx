import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {buyBonusProduct} from '../api/api';
import {getBonusBalanceQueryKey} from './get-bonus-balance-query';

export const useBuyValueCodeWithBonusPointsQuery = (
  bonusProductId: string | undefined,
) => {
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useMutation({
    mutationKey: ['bonusValueCode', userId, bonusProductId],
    mutationFn: () => buyBonusProduct(bonusProductId),
    onSuccess: () =>
      queryClient.invalidateQueries(
        getBonusBalanceQueryKey(userId, isLoggedIn),
      ),
  });
};
