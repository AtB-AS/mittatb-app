import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/modules/geolocation';
import {FOCUS_ORIGIN} from '@atb/api/bff/geocoder';
import {StyleSheet} from '@atb/theme';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import {Feature} from 'geojson';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig} from './MapConfig';
import {SelectionPin} from './components/SelectionPin';
import {LocationBar} from './components/LocationBar';
import {LocationArrow} from './components/LocationArrow';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {SelectionLocationCallback} from './types';

import {isFeaturePoint} from './utils';
import {Location} from '@atb/modules/favorites';
import {NationalStopRegistryFeatures} from './components/national-stop-registry-features';
import {useMapViewConfig} from './hooks/use-map-view-config';

type ExploreLocationMapProps = {
  initialLocation?: Location;
  onLocationSelect: SelectionLocationCallback;
};

export const ExploreLocationMap = ({
  initialLocation,
  onLocationSelect,
}: ExploreLocationMapProps) => {
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle(true);

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const [selectedCoordinates, setSelectedCoordinates] =
    useState(startingCoordinates);

  const onFeatureClick = useCallback(async (feature: Feature) => {
    if (!isFeaturePoint(feature)) return;

    const {coordinates: locationClicked} = feature.geometry;
    setSelectedCoordinates({
      longitude: locationClicked[0],
      latitude: locationClicked[1],
    });
  }, []);

  const onLocationArrowOnPress = async () => {
    const coordinates = await getCurrentCoordinates(true);
    if (coordinates) {
      mapCameraRef.current?.flyTo(
        [coordinates.longitude, coordinates.latitude],
        200,
      );
    }
  };

  const mapViewConfig = useMapViewConfig();

  return (
    <View style={styles.container}>
      <LocationBar
        coordinates={selectedCoordinates || startingCoordinates}
        onSelect={onLocationSelect}
      />
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onPress={onFeatureClick}
          testID="exploreLocationMapView"
          {...mapViewConfig}
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

          <NationalStopRegistryFeatures
            selectedFeaturePropertyId={undefined}
            onMapItemClick={undefined}
          />

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {selectedCoordinates && (
            <SelectionPin coordinates={selectedCoordinates} id="selectionPin" />
          )}
        </MapboxGL.MapView>
        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
          ]}
        >
          <LocationArrow onPress={onLocationArrowOnPress} />
        </View>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));
