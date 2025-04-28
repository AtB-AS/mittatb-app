import {TextNames} from '@atb/theme';
import {ActivityIndicator} from 'react-native';
import {useBonusBalanceQuery} from '..';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {isDefined} from '@atb/utils/presence';

type Props = {
  size: 'small' | 'large';
  color: string;
};

const TYPOGRAPHY_BONUS_BALANCE: Record<Props['size'], TextNames> = {
  small: 'body__secondary',
  large: 'body__primary--jumbo--bold',
};


export const UserBonusBalance = ({color, size}: Props) => {

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  return (
    <>
      {userBonusBalanceStatus === 'loading' ? (
        <ActivityIndicator />
      ) : (
        <ThemeText typography={TYPOGRAPHY_BONUS_BALANCE[size]} color={color}>
          {isDefined(userBonusBalance) &&
          typeof userBonusBalance === 'number' &&
          !Number.isNaN(userBonusBalance)
            ? userBonusBalance
            : '--'}
        </ThemeText>
      )}
      <ThemeIcon color={color} svg={StarFill} size={size} />
    </>
  );
};
