import React from 'react';
import {Button} from '@atb/components/button';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {MapFilterSheet} from '@atb/components/map/components/filter/MapFilterSheet';
import {MapFilterType} from '@atb/components/map/types';
import {StyleSheet} from '@atb/theme';
import {shadows} from '@atb/components/map';
import {Filter} from '@atb/assets/svg/mono-icons/actions';

type MapFilterProps = {
  onFilterChange: (filter: MapFilterType) => void;
};
export const MapFilter = ({onFilterChange}: MapFilterProps) => {
  const style = useStyle();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const onPress = () => {
    openBottomSheet(() => (
      <MapFilterSheet
        onFilterChange={onFilterChange}
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
      leftIcon={{svg: Filter}}
    />
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
