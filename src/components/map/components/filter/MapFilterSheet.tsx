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

type MapFilterSheetProps = {
  close: () => void;
  onFilterChange: (filter: MapFilterType) => void;
};
export const MapFilterSheet = ({
  close,
  onFilterChange,
}: MapFilterSheetProps) => {
  const {t} = useTranslation();
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
    <BottomSheetContainer maxHeightValue={0.5} fullHeight>
      <ScreenHeaderWithoutNavigation
        title="Filter"
        color="background_1"
        leftButton={{
          text: t(ScreenHeaderTexts.headerButton.close.text),
          type: 'close',
          onPress: close,
        }}
      />
      <View>
        <Section withPadding>
          <ToggleSectionItem
            leftIcon={Scooter}
            text={'Sparkesykkel'}
            value={initialFilter?.vehicles?.showVehicles}
            onValueChange={onScooterToggle}
          />
          <ToggleSectionItem
            leftIcon={Bicycle}
            text={'Sykkel'}
            value={initialFilter?.stations?.showCityBikeStations}
            onValueChange={onBicycleToggle}
          />
        </Section>
      </View>
    </BottomSheetContainer>
  );
};
