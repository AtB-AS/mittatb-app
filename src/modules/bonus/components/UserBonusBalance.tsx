import {TextNames, Theme, useThemeContext} from '@atb/theme';
import {ActivityIndicator} from 'react-native';
import {useBonusBalanceQuery} from '..';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {isDefined} from '@atb/utils/presence';

type Props = {
  size: 'small' | 'large';
};

const TYPOGRAPHY_BONUS_BALANCE: Record<Props['size'], TextNames> = {
  small: 'body__secondary',
  large: 'body__primary--jumbo--bold',
};

const getColor = (theme: Theme, size: Props['size']) => {
  const colorMap: Record<Props['size'], string> = {
    small: theme.color.foreground.dynamic.secondary,
    large: theme.color.foreground.dynamic.primary,
  };
  return colorMap[size];
};

export const UserBonusBalance = ({size}: Props) => {
  const {theme} = useThemeContext();

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  const color = getColor(theme, size);

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
