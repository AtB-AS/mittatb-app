import {
  BackArrow,
  flyToLocation,
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  useControlPositionsStyle,
  zoomIn,
  zoomOut,
} from '@atb/components/map';
import {useGeolocationState} from '@atb/GeolocationContext';
import {MapLeg} from '@atb/components/map';
import {Coordinates} from '@atb/utils/coordinates';
import {MapTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Position} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MapLabel from './components/MapLabel';
import MapRoute from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';

export type TravelDetailsMapScreenParams = {
  legs: MapLeg[];
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
};

type Props = TravelDetailsMapScreenParams & {
  onPressBack: () => void;
};

export const TravelDetailsMapScreenComponent = ({
  legs,
  toPlace,
  fromPlace,
  onPressBack,
}: Props) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationState();

  const features = useMemo(() => createMapLines(legs), [legs]);
  const bounds = getMapBounds(features);

  const {t} = useTranslation();
  const controlStyles = useControlPositionsStyle();
  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        {...MapViewConfig}
        onWillStartRenderingMap={() =>
          Bugsnag.leaveBreadcrumb('Start loading map', {
            component: 'DetailsMap',
          })
        }
        onDidFinishRenderingMapFully={() =>
          Bugsnag.leaveBreadcrumb('Finished loading map', {
            component: 'DetailsMap',
          })
        }
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          animationDuration={0}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <MapRoute lines={features}></MapRoute>
        {toPlace && (
          <MapLabel
            point={pointOf(toPlace)}
            id={'end'}
            text={t(MapTexts.endPoint.label)}
          />
        )}
        {fromPlace && (
          <MapLabel
            point={pointOf(fromPlace)}
            id={'start'}
            text={t(MapTexts.startPoint.label)}
          />
        )}
      </MapboxGL.MapView>
      <View style={controlStyles.backArrowContainer}>
        <BackArrow
          accessibilityLabel={t(MapTexts.exitButton.a11yLabel)}
          onBack={onPressBack}
        />
      </View>
      <View style={controlStyles.controlsContainer}>
        <PositionArrow
          onPress={() => {
            flyToLocation(geolocation?.coordinates, mapCameraRef);
          }}
        />
        <MapControls
          zoomIn={() => zoomIn(mapViewRef, mapCameraRef)}
          zoomOut={() => zoomOut(mapViewRef, mapCameraRef)}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mapView: {flex: 1},
  map: {flex: 1},
});
