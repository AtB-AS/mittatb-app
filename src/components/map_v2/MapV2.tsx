import {getCurrentCoordinatesGlobal} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {StyleSheet} from '@atb/theme';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import React, {useRef} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, MapViewConfig} from '@atb/components/map/MapConfig';
import {getFeaturesAtClick} from '@atb/components/map/utils.ts';
import {isFeaturePoint} from '@atb/components/map';
import {usePlugins} from '@atb/components/map_v2/plugins/use-plugins.tsx';
import {useMapRegion} from '@atb/components/map_v2/use-map-region.ts';

export const MapV2 = () => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();

  const startingCoordinates = getCurrentCoordinatesGlobal() || FOCUS_ORIGIN;
  const {mapRegion, onDidFinishLoadingMap, onMapIdle} =
    useMapRegion(mapViewRef);

  const {renderedFeatures, handleClick} = usePlugins(mapRegion);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{flex: 1}}
          pitchEnabled={false}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          onMapIdle={onMapIdle}
          onPress={(f) => {
            if (isFeaturePoint(f)) {
              getFeaturesAtClick(f, mapViewRef).then(
                (f) => f && handleClick(f as any),
              );
            }
          }}
          {...MapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={15}
            centerCoordinate={[
              startingCoordinates.longitude,
              startingCoordinates.latitude,
            ]}
            {...MapCameraConfig}
          />

          {renderedFeatures}

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));
