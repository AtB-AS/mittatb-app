import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {ThemeText} from '@atb/components/text';
import {useHumanizeDistance} from '@atb/utils/location';
import {StyleSheet} from '@atb/theme';

type Props = {
  distance: number | undefined;
  style?: StyleProp<ViewStyle>;
};

export const WalkingDistance = ({style, distance}: Props) => {
  const sheetStyles = useSheetStyle();
  const humanizedDistance = useHumanizeDistance(distance);

  if (!humanizedDistance) return null;

  return (
    <View style={[style, sheetStyles.distanceLabel]}>
      <ThemeIcon svg={Walk} color="secondary" style={sheetStyles.icon} />
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
    marginStart: theme.spacing.small,
    marginEnd: theme.spacing.small,
  },
}));
