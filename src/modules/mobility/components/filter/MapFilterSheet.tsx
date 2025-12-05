import {
  dictionary,
  MapTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {
  MapFilterType,
  MobilityMapFilterType,
  useMapContext,
} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {Close, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {MobilityFilters} from './MobilityFilters';
import {MapBottomSheet} from '@atb/components/bottom-sheet-v2';

type MapFilterSheetProps = {
  onClose: () => void;
  onFilterChanged: (filter: MapFilterType) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};
export const MapFilterSheet = ({
  onClose,
  onFilterChanged,
  locationArrowOnPress,
  navigateToScanQrCode,
}: MapFilterSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();
  const {mapFilter, setMapFilter} = useMapContext();
  const initialFilterRef = useRef(mapFilter);
  const [filter, setFilter] = useState<MapFilterType | undefined>(mapFilter);

  if (!initialFilterRef.current || !filter) {
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
    <MapBottomSheet
      closeCallback={onClose}
      allowBackgroundTouch={false}
      enableDynamicSizing={true}
      heading={t(MapTexts.filters.bottomSheet.heading)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <ScrollView style={style.container}>
        <MobilityFilters
          filter={initialFilterRef.current.mobility}
          onFilterChanged={onMobilityFilterChanged}
        />
      </ScrollView>
      <FullScreenFooter>
        <Button
          expanded={true}
          text={t(TripSearchTexts.filters.bottomSheet.use)}
          onPress={() => {
            setMapFilter(filter);
            onFilterChanged(filter);
            onClose();
          }}
          rightIcon={{svg: Confirm}}
          testID="confirmFilters"
        />
      </FullScreenFooter>
    </MapBottomSheet>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
  };
});
