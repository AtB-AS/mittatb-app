import {useQuery} from '@tanstack/react-query';
import {getActiveBonusProductGroups} from '../api/api';
import {useIsBonusActiveForUser} from '../use-is-bonus-active-for-user';
import {useIsBonusEnrollable} from '../use-is-bonus-enrollable';

export const useActiveBonusProductGroupsQuery = (enabled: boolean = true) => {
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const isBonusEnrollable = useIsBonusEnrollable();

  return useQuery({
    enabled: enabled && (isBonusActiveForUser || isBonusEnrollable),
    queryKey: ['activeBonusProductGroups'],
    queryFn: getActiveBonusProductGroups,
  });
};
