import {TextNames, useThemeContext} from '@atb/theme';
import {ReactNode} from 'react';
import {ActivityIndicator} from 'react-native';
import {useBonusBalanceQuery} from '..';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';

type Props = {
  size: 'small' | 'large';
};

const TYPOGRAPHY_BONUS_BALANCE: Record<Props['size'], TextNames> = {
  small: 'body__secondary',
  large: 'body__primary--jumbo--bold',
};

export const UserBonusBalance = ({size}: Props) => {
  const {theme} = useThemeContext();

  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  return (
    <>
      {userBonusBalanceStatus === 'loading' ? (
        <ActivityIndicator />
      ) : (
        <ThemeText
          typography={TYPOGRAPHY_BONUS_BALANCE[size]}
          color="secondary"
        >
          {userBonusBalance ?? '--'}
        </ThemeText>
      )}
      <ThemeIcon
        color={theme.color.foreground.dynamic.secondary}
        svg={StarFill}
        size={size}
      />
    </>
  );
};
