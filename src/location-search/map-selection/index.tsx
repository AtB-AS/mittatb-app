import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {useReverseGeocoder} from '../useGeocoder';
import colors from '../../theme/colors';
import {
  LocationSearchNavigationProp,
  LocationSearchStackParams,
  LocationWithSearchMetadata,
} from '../';
import insets from '../../utils/insets';
import MapControls from './MapControls';
import {useGeolocationState} from '../../GeolocationContext';
import LocationBar from './LocationBar';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import {SelectionPin} from '../../assets/svg/map';

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoomLevel: number;
  };
};

export type Props = {
  navigation: LocationSearchNavigationProp;
  route: RouteProp<LocationSearchStackParams, 'MapSelection'>;
};

const MapSelection: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, coordinates},
  },
}) => {
  const [region, setRegion] = useState<
    GeoJSON.Feature<GeoJSON.Point, RegionPayload>
  >();

  const locations = useReverseGeocoder(
    region
      ? ({
          coords: {
            latitude: region?.geometry?.coordinates[1],
            longitude: region?.geometry?.coordinates[0],
          },
        } as any)
      : null,
  );

  const {location: geolocation} = useGeolocationState();

  const onSelect = (location: LocationWithSearchMetadata) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const location = locations?.[0];

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

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

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={setRegion}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            width: 40,
            height: 48,
          }}
        >
          <View style={{position: 'absolute', top: -40, right: -20}}>
            <SelectionPin width={40} height={48} />
          </View>
        </View>
      </MapboxGL.MapView>
      <View style={{position: 'absolute', top: 80, left: 20}}>
        <BackArrow onBack={() => navigation.goBack()} />
      </View>
      <View style={{position: 'absolute', top: 80, right: 20}}>
        <MapControls
          flyToCurrentLocation={flyToCurrentLocation}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          paddingHorizontal: 12,
          width: '100%',
        }}
      >
        <LocationBar location={location} onSelect={onSelect} />
      </View>
    </View>
  );
};

const BackArrow: React.FC<{onBack(): void}> = ({onBack}) => {
  return (
    <TouchableOpacity onPress={onBack} hitSlop={insets.symmetric(12, 20)}>
      <View
        style={{
          backgroundColor: colors.primary.gray,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          width: 36,
          height: 28,
        }}
      >
        <ArrowLeft fill={colors.general.white} />
      </View>
    </TouchableOpacity>
  );
};

export default MapSelection;
