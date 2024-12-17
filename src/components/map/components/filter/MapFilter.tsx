import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useTheme} from '@atb/theme';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {useAnalytics} from '@atb/analytics';

type MapFilterProps = {
  onPress: () => void;
};
export const MapFilter = ({onPress}: MapFilterProps) => {
  const style = useStyle();
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[2];
  const analytics = useAnalytics();

  return (
    <Button
      style={style.filterButton}
      type="medium"
      compact={true}
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() => {
        analytics.logEvent('Map', 'Filter button clicked');
        onPress();
      }}
      rightIcon={{svg: Filter}}
      hasShadow={true}
      testID="mapFilter"
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacing.small,
  },
}));
