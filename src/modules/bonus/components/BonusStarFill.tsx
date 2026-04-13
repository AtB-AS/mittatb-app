import React from 'react';
import {SvgProps} from 'react-native-svg';
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';
import {useThemeContext} from '@atb/theme';

export const BonusStarFill = (props: SvgProps) => {
  const {theme} = useThemeContext();
  return (
    <StarFill {...props} fill={theme.color.interactive[0].default.background} />
  );
};
