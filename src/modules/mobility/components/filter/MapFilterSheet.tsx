import {MapTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import React, {useRef} from 'react';

import {
  MapFilterType,
  MobilityMapFilterType,
  useMapContext,
} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';
import {MobilityFilters} from './MobilityFilters';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {Loading} from '@atb/components/loading';

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

  if (!initialFilterRef.current || !mapFilter) {
    return (
      <View style={style.loading}>
        <Loading size="large" />
      </View>
    );
  }

  const onMobilityFilterChanged = (mobility: MobilityMapFilterType) => {
    const tempFilter = {...mapFilter, mobility};
    setMapFilter(tempFilter);
    onFilterChanged(tempFilter);
  };

  return (
    <MapBottomSheet
      closeCallback={onClose}
      allowBackgroundTouch={false}
      enableDynamicSizing={true}
      heading={t(MapTexts.filters.bottomSheet.heading)}
      bottomSheetHeaderType={BottomSheetHeaderType.Confirm}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <View style={style.container}>
        <MobilityFilters
          filter={initialFilterRef.current.mobility}
          onFilterChanged={onMobilityFilterChanged}
        />
      </View>
    </MapBottomSheet>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
  };
});
