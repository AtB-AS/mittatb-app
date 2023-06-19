import React from 'react';
import {Button} from '@atb/components/button';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {MapFilterSheet} from './MapFilterSheet';
import {MapFilterType} from '../../types';
import {StyleSheet} from '@atb/theme';
import {shadows} from '../shadows';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {useAnalytics} from '@atb/analytics';

type MapFilterProps = {
  onFilterChanged: (filter: MapFilterType) => void;
  isLoading: boolean;
};
export const MapFilter = ({onFilterChanged, isLoading}: MapFilterProps) => {
  const style = useStyle();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const analytics = useAnalytics();

  const onPress = () => {
    analytics.logEvent('Map', 'Filter button clicked');
    openBottomSheet(() => (
      <MapFilterSheet
        onFilterChanged={onFilterChanged}
        close={closeBottomSheet}
      />
    ));
  };

  return (
    <Button
      style={style.filterButton}
      type="inline"
      compact={true}
      interactiveColor="interactive_2"
      accessibilityRole="button"
      onPress={onPress}
      leftIcon={{svg: Filter, loading: isLoading}}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
