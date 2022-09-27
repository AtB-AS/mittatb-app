import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {LocationSearchScreenProps} from '@atb/location-search/types';
import {Map} from '@atb/components/map';

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoomLevel: number;
  };
};

export type Props = LocationSearchScreenProps<'MapSelection'>;

const MapSelection: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, coordinates},
  },
}) => {
  const onLocationSelect = (selectedLocation?: any) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: selectedLocation,
    });
  };

  const styles = useMapStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.mapSelection.header.title)}
        leftButton={{type: 'back'}}
      />
      <Map
        onLocationSelect={onLocationSelect}
        coordinates={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }}
        shouldShowSearchBar={true}
        shouldSelectLocation={true}
        zoomLevel={coordinates.zoomLevel}
      />
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));

export default MapSelection;
