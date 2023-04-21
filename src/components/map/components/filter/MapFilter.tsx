import React from 'react';
import {Button} from '@atb/components/button';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {MapFilterSheet} from './MapFilterSheet';
import {MapFilterType} from '../../types';
import {StyleSheet} from '@atb/theme';
import {shadows} from '../shadows';
import {Filter} from '@atb/assets/svg/mono-icons/actions';

type MapFilterProps = {
  onFilterChange: (filter: MapFilterType) => void;
  isLoading: boolean;
};
export const MapFilter = ({onFilterChange, isLoading}: MapFilterProps) => {
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
