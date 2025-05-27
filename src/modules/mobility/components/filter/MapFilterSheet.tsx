import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {MapTexts, TripSearchTexts, useTranslation} from '@atb/translations';
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
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {MobilityFilters} from './MobilityFilters';

type MapFilterSheetProps = {
  onClose: () => void;
  onFilterChanged: (filter: MapFilterType) => void;
};
export const MapFilterSheet = ({
  onClose,
  onFilterChanged,
}: MapFilterSheetProps) => {
  const {t} = useTranslation();
  const style = useStyle();
  const {mapFilter, setMapFilter} = useMapContext();
  const initialFilterRef = useRef(mapFilter);
  const [filter, setFilter] = useState<MapFilterType | undefined>(mapFilter);
  const {close: closeBottomSheet} = useBottomSheetContext();

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
    <BottomSheetContainer
      title={t(MapTexts.filters.bottomSheet.heading)}
      onClose={onClose}
      maxHeightValue={0.9}
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
            closeBottomSheet();
          }}
          rightIcon={{svg: Confirm}}
          testID="confirmFilters"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
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
