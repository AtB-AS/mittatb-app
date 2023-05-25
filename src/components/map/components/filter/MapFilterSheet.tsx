import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MapFilterType} from '../../types';
import {useUserMapFilters} from '@atb/components/map';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {Scooter} from '@atb/assets/svg/mono-icons/transportation-entur';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Car} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useIsCityBikesEnabled, useIsVehiclesEnabled} from '@atb/mobility';
import {useIsCarSharingEnabled} from '@atb/mobility/use-car-sharing-enabled';

type MapFilterSheetProps = {
  close: () => void;
  onFilterChange: (filter: MapFilterType) => void;
};
export const MapFilterSheet = ({
  close,
  onFilterChange,
}: MapFilterSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();
  const {getMapFilter, setMapFilter} = useUserMapFilters();
  const [initialFilter, setInitialFilter] = useState<MapFilterType>();

  useEffect(() => {
    getMapFilter().then(setInitialFilter);
  }, []);

  const onScooterToggle = (checked: boolean) => {
    getMapFilter()
      .then((currentFilter) => {
        const newFilter = {
          ...currentFilter,
          vehicles: {
            showVehicles: checked,
          },
        };
        onFilterChange(newFilter);
        return newFilter;
      })
      .then(setMapFilter);
  };

  const onBicycleToggle = async (checked: boolean) => {
    getMapFilter()
      .then((currentFilter) => {
        const newFilter = {
          ...currentFilter,
          stations: {
            ...currentFilter.stations,
            showCityBikeStations: checked,
          },
        };
        onFilterChange(newFilter);
        return newFilter;
      })
      .then(setMapFilter);
  };

  const onCarToggle = async (checked: boolean) => {
    getMapFilter()
      .then((currentFilter) => {
        const newFilter = {
          ...currentFilter,
          stations: {
            ...currentFilter.stations,
            showCarSharingStations: checked,
          },
        };
        onFilterChange(newFilter);
        return newFilter;
      })
      .then(setMapFilter);
  };

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title=" "
        color="background_1"
        leftButton={{
          text: t(ScreenHeaderTexts.headerButton.close.text),
          type: 'close',
          onPress: close,
        }}
      />
      <View style={style.container}>
        <Section withPadding>
          {isVehiclesEnabled && (
            <ToggleSectionItem
              leftIcon={Scooter}
              text={t(MobilityTexts.scooter)}
              value={initialFilter?.vehicles?.showVehicles}
              onValueChange={onScooterToggle}
            />
          )}
          {isCityBikesEnabled && (
            <ToggleSectionItem
              leftIcon={Bicycle}
              text={t(MobilityTexts.bicycle)}
              value={initialFilter?.stations?.showCityBikeStations}
              onValueChange={onBicycleToggle}
            />
          )}
          {isCarSharingEnabled && (
            <ToggleSectionItem
              leftIcon={Car}
              text={t(MobilityTexts.car)}
              value={initialFilter?.stations?.showCarSharingStations}
              onValueChange={onCarToggle}
            />
          )}
        </Section>
      </View>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginBottom: theme.spacings.large,
  },
}));
