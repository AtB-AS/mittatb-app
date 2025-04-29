import {useMutation} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {buyBonusProduct} from '../api/api';

export const useBuyValueCodeWithBonusPointsQuery = (
  bonusProductId: string | undefined,
) => {
  const {userId} = useAuthContext();
  return useMutation({
    mutationKey: ['bonusValueCode', userId, bonusProductId],
    mutationFn: () => buyBonusProduct(bonusProductId),
  });
};
