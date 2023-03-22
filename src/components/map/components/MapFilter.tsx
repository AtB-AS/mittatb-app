import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {MapTexts, useTranslation} from '@atb/translations';
import {MapFilter as MapFilterType} from '../types';
import {Scooter} from '@atb/assets/svg/mono-icons/transportation-entur';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {shadows} from '@atb/components/map';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';

type MapFilterProps = {
  isLoading: {
    vehicles: boolean;
    stations: boolean;
  };
  onFilterChange: (filter: MapFilterType) => void;
};
type IconColors =
  | Extract<InteractiveColor, 'interactive_0'>
  | Extract<InteractiveColor, 'interactive_2'>;
export const MapFilter = ({isLoading, onFilterChange}: MapFilterProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {getMapFilter, setMapFilter} = useUserMapFilters();
  const iconColors: {[key: string]: IconColors} = {
    active: 'interactive_0',
    disabled: 'interactive_2',
  };
  const [scooterButtonColor, setScooterButtonColor] = useState<IconColors>(
    iconColors.active,
  );
  const [bicycleButtonColor, setBicycleButtonColor] = useState<IconColors>(
    iconColors.active,
  );

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setScooterButtonColor(
        initialFilter.vehicles?.showVehicles
          ? iconColors.active
          : iconColors.disabled,
      );
    });
  }, []);

  const toggleButtonColor = (current: InteractiveColor) =>
    current === iconColors.active ? iconColors.disabled : iconColors.active;

  const onScooterToggle = async () => {
    const currentFilter = await getMapFilter();
    const newFilter = {
      ...currentFilter,
      vehicles: {
        showVehicles: !currentFilter.vehicles?.showVehicles,
      },
    };
    await setMapFilter(newFilter);
    setScooterButtonColor(toggleButtonColor);
    onFilterChange(newFilter);
  };

  const onBicycleToggle = async () => {
    const currentFilter = await getMapFilter();
    const newFilter = {
      ...currentFilter,
      stations: {
        showCityBikeStations: !currentFilter.stations?.showCityBikeStations,
      },
    };
    await setMapFilter(newFilter);
    setBicycleButtonColor(toggleButtonColor);
    onFilterChange(newFilter);
  };

  return (
    <>
      <Button
        type="inline"
        compact={true}
        interactiveColor={scooterButtonColor}
        disabled={isLoading.vehicles}
        accessibilityRole="button"
        accessibilityLabel={t(MapTexts.controls.filter.vehicles.a11yLabel)}
        accessibilityHint={t(MapTexts.controls.filter.vehicles.a11yHint)}
        onPress={onScooterToggle}
        leftIcon={{svg: isLoading.vehicles ? Duration : Scooter}}
        style={styles.filterButton}
      />
      <Button
        type="inline"
        compact={true}
        interactiveColor={bicycleButtonColor}
        disabled={isLoading.stations}
        accessibilityRole="button"
        accessibilityLabel={t(MapTexts.controls.filter.vehicles.a11yLabel)}
        accessibilityHint={t(MapTexts.controls.filter.vehicles.a11yHint)}
        onPress={onBicycleToggle}
        leftIcon={{svg: isLoading.stations ? Duration : Bicycle}}
        style={styles.filterButton}
      />
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacings.small,
    ...shadows,
  },
}));
