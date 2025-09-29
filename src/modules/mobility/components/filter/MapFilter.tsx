import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {MapStateActionType, useMapContext} from '@atb/modules/map';

export const MapFilter = () => {
  const style = useStyle();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const analytics = useAnalyticsContext();
  const {dispatchMapState} = useMapContext();

  return (
    <Button
      expanded={false}
      style={style.filterButton}
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() => {
        analytics.logEvent('Map', 'Filter button clicked');
        dispatchMapState({
          type: MapStateActionType.Filter,
        });
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
