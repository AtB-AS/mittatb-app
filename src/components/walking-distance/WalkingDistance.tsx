import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {ThemeText} from '@atb/components/text';
import {useHumanizeDistance} from '@atb/utils/location';
import {useTheme} from '@atb/theme';

type Props = {
  distance: number | undefined;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};
export const WalkingDistance = ({style, iconStyle, distance}: Props) => {
  const humanizedDistance = useHumanizeDistance(distance);
  const {theme} = useTheme();

  if (!humanizedDistance) return null;

  return (
    <View style={[style, {flexDirection: 'row', justifyContent: 'center'}]}>
      <ThemeIcon
        style={iconStyle}
        svg={Walk}
        fill={theme.text.colors.secondary}
      />
      <ThemeText type="body__secondary" color="secondary">
        {humanizedDistance}
      </ThemeText>
    </View>
  );
};
