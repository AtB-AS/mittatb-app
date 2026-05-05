import {useQuery} from '@tanstack/react-query';
import {getActiveBonusProducts} from '../api/api';
import {useIsBonusActiveForUser} from '../use-is-bonus-active-for-user';
import {useIsBonusEnrollable} from '../use-is-bonus-enrollable';

export const useActiveBonusProductsQuery = () => {
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const isBonusEnrollable = useIsBonusEnrollable();

  return useQuery({
    enabled: isBonusActiveForUser || isBonusEnrollable,
    queryKey: ['activeBonusProducts'],
    queryFn: getActiveBonusProducts,
  });
};
