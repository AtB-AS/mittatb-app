import {useIsBonusActiveForUser} from './use-is-bonus-active-for-user';
import {useBonusBalanceQuery} from './queries';

type BonusBalanceButtonVisible =
  | {isVisible: true; bonusBalance: number}
  | {isVisible: false; bonusBalance: number | undefined};

export function useIsBonusBalanceButtonVisible(): BonusBalanceButtonVisible {
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const {data: bonusBalance} = useBonusBalanceQuery();
  if (isBonusActiveForUser && bonusBalance != null) {
    return {isVisible: true, bonusBalance};
  }
  return {isVisible: false, bonusBalance};
}
