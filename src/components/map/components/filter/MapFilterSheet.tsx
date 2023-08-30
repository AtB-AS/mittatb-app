import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  MapTexts,
  ScreenHeaderTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MapFilterType, MobilityMapFilterType} from '../../types';
import {useUserMapFilters} from '@atb/components/map';
import {StyleSheet} from '@atb/theme';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MobilityFilters} from '@atb/mobility/components/filter/MobilityFilters';

type MapFilterSheetProps = {
  close: () => void;
  onFilterChanged: (filter: MapFilterType) => void;
};
export const MapFilterSheet = ({
  close,
  onFilterChanged,
}: MapFilterSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();
  const {getMapFilter, setMapFilter} = useUserMapFilters();
  const [initialFilter, setInitialFilter] = useState<MapFilterType>();
  const [filter, setFilter] = useState<MapFilterType>();

  useEffect(() => {
    getMapFilter().then((f) => {
      setInitialFilter(f);
      setFilter(f);
    });
  }, []);

  if (!initialFilter || !filter) {
    return (
      <View style={style.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onMobilityFilterChanged = (mobility: MobilityMapFilterType) => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      mobility,
    }));
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
        <MobilityFilters
          filter={initialFilter.mobility}
          onFilterChanged={onMobilityFilterChanged}
        />
      </ScrollView>
      <FullScreenFooter>
        <Button
          text={t(TripSearchTexts.filters.bottomSheet.use)}
          onPress={() => {
            setMapFilter(filter);
            onFilterChanged(filter);
            close();
          }}
          rightIcon={{svg: Confirm}}
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
  };
});
