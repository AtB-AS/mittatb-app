import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {MapTexts, useTranslation} from '@atb/translations';
import {MapFilter as MapFilterType} from '../types';
import * as EnturTransportationIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {shadows} from '@atb/components/map';
import {Duration} from '@atb/assets/svg/mono-icons/time';

type MapFilterProps = {
  isLoading: boolean;
  initialState: MapFilterType;
  onFilterChange: (filter: MapFilterType) => void;
};
type IconColors =
  | Extract<InteractiveColor, 'interactive_0'>
  | Extract<InteractiveColor, 'interactive_2'>;
export const MapFilter = ({
  isLoading,
  initialState,
  onFilterChange,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [filter, setFilter] = useState<MapFilterType>(initialState);
  const [iconColor, setIconColor] = useState<IconColors>('interactive_0');
  const iconColors: {[key: string]: IconColors} = {
    showScooters: 'interactive_0',
    hideScooters: 'interactive_2',
  };

  useEffect(() => {
    setFilter(initialState);
    setIconColor(
      initialState.vehicles?.showVehicles
        ? iconColors.showScooters
        : iconColors.hideScooters,
    );
  }, [initialState]);

  const toggleIconColor = (current: InteractiveColor) =>
    current === iconColors.showScooters
      ? iconColors.hideScooters
      : iconColors.showScooters;

  const onScooterToggle = () => {
    const newFilter = {
      ...filter,
      vehicles: {
        showVehicles: !filter.vehicles?.showVehicles,
      },
    };
    setFilter(newFilter);
    setIconColor(toggleIconColor);
    onFilterChange(newFilter);
  };

  return (
    <Button
      type="inline"
      compact={true}
      interactiveColor={iconColor}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={t(MapTexts.controls.filter.vehicles.a11yLabel)}
      accessibilityHint={t(MapTexts.controls.filter.vehicles.a11yHint)}
      onPress={onScooterToggle}
      leftIcon={{svg: isLoading ? Duration : EnturTransportationIcons.Scooter}}
      style={styles.filterButton}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
