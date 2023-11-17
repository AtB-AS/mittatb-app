import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {ThemeText} from '@atb/components/text';
import {useHumanizeDistance} from '@atb/utils/location';
import {StyleSheet, useTheme} from '@atb/theme';

type Props = {
  distance: number | undefined;
  style?: StyleProp<ViewStyle>;
};
export const MobilityDistance = ({style, distance}: Props) => {
  const humanizedDistance = useHumanizeDistance(distance);
  const {theme} = useTheme();
  const sheetStyle = useSheetStyle();

  if (!humanizedDistance) return null;

  return (
    <View style={[style, sheetStyle.distanceLabel]}>
      <ThemeIcon
        svg={Walk}
        fill={theme.text.colors.secondary}
        style={sheetStyle.icon}
      />
      <ThemeText type="body__secondary" color="secondary">
        {humanizedDistance}
      </ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  distanceLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginStart: theme.spacings.small,
    marginEnd: theme.spacings.small,
  },
}));
