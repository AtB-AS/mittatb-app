import React, {useRef} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {StyleSheet, View} from 'react-native';
import {useGeolocationState} from '../../../GeolocationContext';
import {RouteProp} from '@react-navigation/native';
import {DetailsModalStackParams} from '..';
import {DetailScreenNavigationProp} from '../Details';
import {getMapBounds, legsToMapLines, pointOf} from './utils';
import MapRoute from './MapRoute';
import MapLabel from './MapLabel';
import {
  MapViewConfig,
  MapCameraConfig,
  MapControls,
  PositionArrow,
  BackArrow,
  useControlPositionsStyle,
} from '../../../components/map/';
import {Leg} from '../../../sdk';
import Bugsnag from '@bugsnag/react-native';
import {MapTexts} from '../../../translations';
import {useTranslation} from '../../../translations';

export type MapDetailRouteParams = {
  legs: Leg[];
};
export type MapDetailRouteProp = RouteProp<
  DetailsModalStackParams,
  'DetailsMap'
>;
type MapProps = {
  route: MapDetailRouteProp;
  navigation: DetailScreenNavigationProp;
};

export const TravelDetailsMap: React.FC<MapProps> = ({route, navigation}) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationState();
  const {legs} = route.params;

  const features = legsToMapLines(legs);
  const startPoint = pointOf(legs[0].fromPlace);
  const endPoint = pointOf(legs[legs.length - 1].toPlace);
  const bounds = getMapBounds(features);

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation?.coords.longitude, geolocation?.coords.latitude],
        750,
      );
  }
  const {t} = useTranslation();
  const controlStyles = useControlPositionsStyle();
  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        {...MapViewConfig}
        onWillStartRenderingMap={() => log('Start loading map')}
        onDidFinishRenderingMapFully={() => log('Finished loading map')}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          animationDuration={0}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <MapRoute lines={features}></MapRoute>
        <MapLabel
          point={endPoint}
          id={'end'}
          text={t(MapTexts.endPoint.label)}
        ></MapLabel>
        <MapLabel
          point={startPoint}
          id={'start'}
          text={t(MapTexts.startPoint.label)}
        ></MapLabel>
      </MapboxGL.MapView>
      <View style={controlStyles.backArrowContainer}>
        <BackArrow
          accessibilityLabel={t(MapTexts.exitButton.a11yLabel)}
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={controlStyles.controlsContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
        <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mapView: {flex: 1},
  map: {
    flex: 1,
  },
});

function log(message: string) {
  Bugsnag.leaveBreadcrumb(message, {component: 'DetailsMap'});
}

export default TravelDetailsMap;
