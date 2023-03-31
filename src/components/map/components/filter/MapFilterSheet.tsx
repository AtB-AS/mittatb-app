import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MapFilterType} from '@atb/components/map/types';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {Scooter} from '@atb/assets/svg/mono-icons/transportation-entur';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {StyleSheet} from '@atb/theme';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

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
            showCityBikeStations: checked,
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
          <ToggleSectionItem
            leftIcon={Scooter}
            text={t(MobilityTexts.scooter)}
            value={initialFilter?.vehicles?.showVehicles}
            onValueChange={onScooterToggle}
          />
          <ToggleSectionItem
            leftIcon={Bicycle}
            text={t(MobilityTexts.bicycle)}
            value={initialFilter?.stations?.showCityBikeStations}
            onValueChange={onBicycleToggle}
          />
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
