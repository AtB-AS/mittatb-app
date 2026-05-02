import {View} from 'react-native';
import React, {useRef} from 'react';

import {
  MapFilterType,
  MobilityMapFilterType,
  useMapContext,
} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';
import {MobilityFilters} from './MobilityFilters';
import {Loading} from '@atb/components/loading';

type MapFilterSheetProps = {
  onFilterChanged: (filter: MapFilterType) => void;
};
export const MapFilterSheet = ({onFilterChanged}: MapFilterSheetProps) => {
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
    <View style={style.container}>
      <MobilityFilters
        filter={initialFilterRef.current.mobility}
        onFilterChanged={onMobilityFilterChanged}
      />
    </View>
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
