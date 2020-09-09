import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef, useMemo} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {useReverseGeocoder} from '../../geocoder';
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
import {StyleSheet} from '../../theme';
import shadows from './shadows';
import {Coordinates} from '@entur/sdk';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import SelectionPin, {PinMode} from './SelectionPin';

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
  isMoving: boolean;
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

  const {locations, isSearching, hasError} = useReverseGeocoder(
    centeredCoordinates,
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
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={(region) =>
          setRegionEvent({isMoving: false, region})
        }
        onRegionWillChange={() =>
          setRegionEvent({isMoving: true, region: regionEvent?.region})
        }
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
      <View style={styles.positionArrowContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
      </View>
      <View style={styles.locationContainer}>
        <LocationBar
          location={location}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isMoving || isSearching}
        />
      </View>
      <View style={styles.controlsContainer}>
        <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
      </View>
      <View style={styles.pinContainer} pointerEvents="none">
        <View style={styles.pin}>
          <SelectionPin
            mode={getPinMode(!!regionEvent?.isMoving, isSearching, !!location)}
          />
        </View>
      </View>
    </View>
  );
};

function getPinMode(
  isMoving: boolean,
  isSearching: boolean,
  hasLocation: boolean,
): PinMode {
  if (isMoving) return 'movestart';
  if (isSearching) return 'moveend';
  if (hasLocation) return 'found';

  return 'nothing';
}

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

const PositionArrow: React.FC<{flyToCurrentLocation(): void}> = ({
  flyToCurrentLocation,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel="Min posisjon"
      accessibilityRole="button"
      onPress={flyToCurrentLocation}
    >
      <View style={styles.flyToButton}>
        <CurrentLocationArrow />
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
  positionArrowContainer: {position: 'absolute', top: 80, right: 20},
  controlsContainer: {position: 'absolute', bottom: 80, right: 20},
  locationContainer: {
    position: 'absolute',
    top: 120,
    paddingHorizontal: 20,
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
  flyToButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...shadows,
  },
});

export default MapSelection;
