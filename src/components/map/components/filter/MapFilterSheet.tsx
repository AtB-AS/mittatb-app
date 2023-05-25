import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  MapTexts,
  ScreenHeaderTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView} from 'react-native';
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
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';

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
    <BottomSheetContainer maxHeightValue={0.9}>
      <ScreenHeaderWithoutNavigation
        title={t(MapTexts.filters.bottomSheet.heading)}
        color="background_1"
        leftButton={{
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
          type: 'cancel',
          onPress: close,
        }}
      />
      <ScrollView style={style.container}>
        <Section>
          {isVehiclesEnabled && (
            <Section>
              <ToggleSectionItem
                text={t(MobilityTexts.scooter)}
                textType={'body__primary--bold'}
                leftIcon={Scooter}
                value={initialFilter?.vehicles?.showVehicles}
                onValueChange={onScooterToggle}
              />
              <ToggleSectionItem
                text={'Ryde'}
                value={true}
                onValueChange={onScooterToggle}
              />
              <ToggleSectionItem
                text={'Tier'}
                value={true}
                onValueChange={onScooterToggle}
              />
              <ToggleSectionItem
                text={'Voi'}
                value={true}
                onValueChange={onScooterToggle}
              />
            </Section>
          )}
          {isCityBikesEnabled && (
            <Section style={style.filterGroup}>
              <ToggleSectionItem
                text={t(MobilityTexts.bicycle)}
                textType={'body__primary--bold'}
                leftIcon={Bicycle}
                value={initialFilter?.stations?.showCityBikeStations}
                onValueChange={() => {}}
              />
              <ToggleSectionItem
                text={'Trondheim Bysykkel'}
                value={true}
                onValueChange={() => {}}
              />
            </Section>
          )}
          {isCarSharingEnabled && (
            <Section style={style.filterGroup}>
              <ToggleSectionItem
                text={t(MobilityTexts.car)}
                textType={'body__primary--bold'}
                leftIcon={Car}
                value={initialFilter?.stations?.showCarSharingStations}
                onValueChange={() => {}}
              />
              <ToggleSectionItem
                text={'Hertz'}
                value={true}
                onValueChange={() => {}}
              />
              <ToggleSectionItem
                text={'Otto'}
                value={true}
                onValueChange={() => {}}
              />
            </Section>
          )}
        </Section>
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(TripSearchTexts.filters.bottomSheet.use)}
          onPress={() => {}}
          rightIcon={{svg: Confirm}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  filterGroup: {
    marginTop: theme.spacings.medium,
  },
}));
