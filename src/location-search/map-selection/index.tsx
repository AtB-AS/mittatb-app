import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef, useMemo} from 'react';
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
import {StyleSheet} from '../../theme';
import shadows from './shadows';
import {Coordinates} from '@entur/sdk';
import {Feature} from 'geojson';

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

type RegionEvent = {
  isChanging: boolean;
  region?: GeoJSON.Feature<GeoJSON.Point, RegionPayload>;
};

const MapSelection: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, coordinates},
  },
}) => {
  const [regionEvent, setRegionEvent] = useState<RegionEvent>();

  const centeredCoordinates = useMemo<Coordinates | null>(
    () =>
      (regionEvent?.region?.geometry && {
        latitude: regionEvent.region.geometry.coordinates[1],
        longitude: regionEvent.region?.geometry?.coordinates[0],
      }) ??
      null,
    [
      regionEvent?.region?.geometry?.coordinates[0],
      regionEvent?.region?.geometry?.coordinates[1],
    ],
  );

  const locations = useReverseGeocoder(centeredCoordinates);

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

  const flyToFeature = (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={(region) =>
          setRegionEvent({isChanging: false, region})
        }
        onRegionWillChange={() =>
          setRegionEvent({isChanging: true, region: regionEvent?.region})
        }
        onPress={flyToFeature}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
          animationMode="moveTo"
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
      </MapboxGL.MapView>
      <View style={styles.backArrowContainer}>
        <BackArrow onBack={() => navigation.goBack()} />
      </View>
      <View style={styles.controlsContainer}>
        <MapControls
          flyToCurrentLocation={flyToCurrentLocation}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
      </View>
      <View style={styles.pinContainer} pointerEvents="none">
        <View style={styles.pin}>
          <SelectionPin width={40} height={60} />
        </View>
      </View>
      <View style={styles.locationContainer}>
        <LocationBar
          location={location}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isChanging}
        />
      </View>
    </View>
  );
};

const BackArrow: React.FC<{onBack(): void}> = ({onBack}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Gå tilbake"
      accessibilityRole="button"
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
    >
      <View style={styles.backArrow}>
        <ArrowLeft fill={colors.general.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  pin: {position: 'absolute', top: -50, right: -20, ...shadows},
  backArrowContainer: {position: 'absolute', top: 80, left: 20},
  controlsContainer: {position: 'absolute', top: 80, right: 20},
  locationContainer: {
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: 12,
    width: '100%',
  },
  backArrow: {
    backgroundColor: colors.primary.gray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 28,
    ...shadows,
  },
});

export default MapSelection;
