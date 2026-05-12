import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {claimBonusProductVoucher} from '../api/api';
import {getBonusBalanceQueryKey} from './use-bonus-balance-query';

export const useClaimBonusProductVoucherMutation = (
  productId: string | undefined,
  operatorId: string | undefined,
) => {
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();

  return useMutation({
    mutationKey: ['claimBonusProductVoucher', userId, productId, operatorId],
    mutationFn: () => {
      if (!productId || !operatorId)
        throw new Error('Missing productId or operatorId');
      return claimBonusProductVoucher(productId, operatorId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getBonusBalanceQueryKey(userId),
      }),
  });
};
