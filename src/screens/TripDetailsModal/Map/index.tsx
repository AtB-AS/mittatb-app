import React, {useRef} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {StyleSheet, View} from 'react-native';
import {useGeolocationState} from '../../../GeolocationContext';
import {Leg} from '@entur/sdk';
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
  const bounds = getMapBounds(features, 50);

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
  const controlStyles = useControlPositionsStyle();
  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView ref={mapViewRef} style={styles.map} {...MapViewConfig}>
        <MapboxGL.Camera ref={mapCameraRef} bounds={bounds} {...MapCameraConfig} />
        <MapRoute lines={features}></MapRoute>
        <MapLabel point={endPoint} id={'end'} text="Slutt"></MapLabel>
        <MapLabel point={startPoint} id={'start'} text="Start"></MapLabel>
        <MapboxGL.UserLocation showsUserHeadingIndicator />
      </MapboxGL.MapView>
      <View style={controlStyles.backArrowContainer}>
        <BackArrow onBack={() => navigation.goBack()} />
      </View>
      <View style={controlStyles.positionArrowContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
      </View>
      <View style={controlStyles.controlsContainer}>
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
export default TravelDetailsMap;
