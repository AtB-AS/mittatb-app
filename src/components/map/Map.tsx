import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '@atb/components/map/index';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import React, {useMemo, useRef, forwardRef} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import useSelectedFeatureChangeEffect, {
  findClickedStopPlace,
} from './use-selected-feature-change-effect';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {
  flyToLocation,
  isFeaturePoint,
  zoomIn,
  zoomOut,
} from '@atb/components/map/utils';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {ScreenHeaderWithoutNavigation} from '../screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map
 * should behave
 *  - ExploreStops: If only the Stop Places (Bus, Trams stops etc.) should be
 *    interactable
 *  - ExploreLocation: If every selected location should be interactable. It
 *    also shows the Location bar on top of the Map to show the currently
 *    selected location
 */
export type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

type MapProps = {
  initialLocation?: Location;
  selectionMode: MapSelectionMode;
  onLocationSelect?: (selectedLocation?: GeoLocation | SearchLocation) => void;
};

const Map = ({initialLocation, selectionMode, onLocationSelect}: MapProps) => {
  const {location: currentLocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : currentLocation?.coordinates || FOCUS_ORIGIN,
    [],
  );

  const {mapLines, selectedCoordinates, onMapClick} =
    useSelectedFeatureChangeEffect(
      selectionMode,
      startingCoordinates,
      mapViewRef,
      mapCameraRef,
    );

  return (
    <View style={styles.container}>
      {selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates || startingCoordinates}
          onSelect={onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          onPress={async (feature: Feature) => {
            if (isFeaturePoint(feature)) {
              onMapClick(feature);

              const stopPlaceFeature = await findClickedStopPlace(
                feature,
                mapViewRef,
              );

              if (stopPlaceFeature) {
                openBottomSheet(
                  (close, focusRef) => (
                    <DeparturesDialogSheet
                      stopPlace={stopPlaceFeature}
                      close={close}
                      ref={focusRef}
                    />
                  ),
                  closeRef,
                );
              }
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
          {mapLines && <MapRoute lines={mapLines} />}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
          {selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <MapboxGL.PointAnnotation
              id={'selectionPin'}
              coordinate={[
                selectedCoordinates.longitude,
                selectedCoordinates.latitude,
              ]}
            >
              <View style={styles.pin}>
                <SelectionPinConfirm width={40} height={40} />
                <SelectionPinShadow width={40} height={4} />
              </View>
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {currentLocation && (
            <PositionArrow
              onPress={() => {
                onMapClick(currentLocation.coordinates);
                flyToLocation(currentLocation.coordinates, 750, mapCameraRef);
              }}
            />
          )}
          <MapControls
            zoomIn={() => zoomIn(mapViewRef, mapCameraRef)}
            zoomOut={() => zoomOut(mapViewRef, mapCameraRef)}
          />
        </View>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pin: {...shadows},
}));

type DeparturesDialogSheetProps = {
  close: () => void;
  stopPlace: Feature<Point, GeoJsonProperties>;
};

const DeparturesDialogSheet = forwardRef<View, DeparturesDialogSheetProps>(
  ({close, stopPlace}, focusRef) => {
    const {t} = useTranslation();

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={stopPlace.properties?.name}
          color="background_1"
          leftButton={{
            type: 'close',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
        />
        <View ref={focusRef} accessible={true}></View>
      </BottomSheetContainer>
    );
  },
);

export default Map;
