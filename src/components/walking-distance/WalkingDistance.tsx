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
  isMobility: boolean;
};

export const WalkingDistance = ({style, distance, isMobility}: Props) => {
  const sheetStyles = useSheetStyle();
  const humanizedDistance = useHumanizeDistance(distance);
  const {theme} = useTheme();

  const labelStyle = isMobility ? sheetStyles.mobilityLabel : sheetStyles.distanceLabel;
  const iconStyle = isMobility ? sheetStyles.icon : {}

  if (!humanizedDistance) return null;

  return (
    <View style={[style, labelStyle]}>
      <ThemeIcon svg={Walk} fill={theme.text.colors.secondary} style={iconStyle}/>
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
    paddingBottom: theme.spacings.medium,
  },
  mobilityLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginStart: theme.spacings.small,
    marginEnd: theme.spacings.small,
  },
}));
