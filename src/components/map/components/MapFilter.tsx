import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {MapTexts, useTranslation} from '@atb/translations';
import {MapFilter as MapFilterType} from '../types';
import * as EnturTransportationIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {shadows} from '@atb/components/map';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';

type MapFilterProps = {
  isLoading: boolean;
  onFilterChange: (filter: MapFilterType) => void;
};
type IconColors =
  | Extract<InteractiveColor, 'interactive_0'>
  | Extract<InteractiveColor, 'interactive_2'>;
export const MapFilter = ({
  isLoading,

  onFilterChange,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {getMapFilter, setMapFilter} = useUserMapFilters();
  const [iconColor, setIconColor] = useState<IconColors>('interactive_0');
  const iconColors: {[key: string]: IconColors} = {
    showScooters: 'interactive_0',
    hideScooters: 'interactive_2',
  };

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setIconColor(
        initialFilter.vehicles?.showVehicles
          ? iconColors.showScooters
          : iconColors.hideScooters,
      );
    });
  }, []);

  const toggleIconColor = (current: InteractiveColor) =>
    current === iconColors.showScooters
      ? iconColors.hideScooters
      : iconColors.showScooters;

  const onScooterToggle = async () => {
    const currentFilter = await getMapFilter();
    const newFilter = {
      ...currentFilter,
      vehicles: {
        showVehicles: !currentFilter.vehicles?.showVehicles,
      },
    };
    setMapFilter(newFilter);
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
