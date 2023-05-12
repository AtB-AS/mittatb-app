import React from 'react';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {ThemeText} from '@atb/components/text';
import {useHumanizeDistance} from '@atb/utils/location';
import {StyleSheet, useTheme} from '@atb/theme';

type Props = {
  distance: number | undefined;
};
export const WalkingDistance = ({distance}: Props) => {
  const style = useSheetStyle();
  const humanizedDistance = useHumanizeDistance(distance);
  const {theme} = useTheme();

  if (!humanizedDistance) return null;

  return (
    <View style={style.distanceLabel}>
      <ThemeIcon svg={Walk} fill={theme.text.colors.secondary}></ThemeIcon>
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
}));
