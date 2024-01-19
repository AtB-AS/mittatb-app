import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {useAnalytics} from '@atb/analytics';

type MapFilterProps = {
  onPress: () => void;
  isLoading: boolean;
};
export const MapFilter = ({onPress, isLoading}: MapFilterProps) => {
  const style = useStyle();
  const analytics = useAnalytics();

  return (
    <Button
      style={style.filterButton}
      type="inline"
      compact={true}
      interactiveColor="interactive_2"
      accessibilityRole="button"
      onPress={() => {
        analytics.logEvent('Map', 'Filter button clicked');
        onPress();
      }}
      loading={isLoading}
      rightIcon={{svg: Filter}}
      hasShadow={true}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacings.small,
  },
}));
