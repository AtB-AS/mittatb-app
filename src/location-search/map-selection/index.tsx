import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef, useMemo} from 'react';
import {Text, Platform, View, TouchableOpacity, ViewStyle} from 'react-native';

import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {useReverseGeocoder} from '../../geocoder';
import colors from '../../theme/colors';
import {LocationSearchNavigationProp, LocationSearchStackParams} from '../';
import insets from '../../utils/insets';
import MapControls from './MapControls';
import {useGeolocationState} from '../../GeolocationContext';
import LocationBar from './LocationBar';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import {StyleSheet, useTheme} from '../../theme';
import shadows from './shadows';
import {Coordinates} from '@entur/sdk';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import SelectionPin, {PinMode} from './SelectionPin';
import {Feature} from 'geojson';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MAPBOX_STOP_PLACES_STYLE_URL} from 'react-native-dotenv';

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

  const location = locations?.[0];

  const onSelect = () => {
    location &&
      navigation.navigate(callerRouteName as any, {
        [callerRouteParam]: {...location, resultType: 'search'},
      });
  };

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

  const controlStyles = useControlPositionsStyle();

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
        onPress={flyToFeature}
        compassViewPosition={3}
        compassEnabled={true}
        compassViewMargins={{
          x: Platform.select({default: 10, android: 6}),
          y: 90,
        }}
        attributionPosition={Platform.select({
          default: {bottom: 8, left: 95},
          android: {bottom: 5, left: 90},
        })}
        styleURL={MAPBOX_STOP_PLACES_STYLE_URL}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
          animationMode="moveTo"
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
      </MapboxGL.MapView>
      <View style={styles.pinContainer}>
        <TouchableOpacity onPress={onSelect} style={styles.pin}>
          <SelectionPin
            isMoving={!!regionEvent?.isMoving}
            mode={getPinMode(
              !!regionEvent?.isMoving || isSearching,
              !!location,
            )}
          />
        </TouchableOpacity>
      </View>
      <View style={controlStyles.backArrowContainer}>
        <BackArrow onBack={() => navigation.goBack()} />
      </View>
      <View style={controlStyles.positionArrowContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
      </View>
      <View style={controlStyles.locationContainer}>
        <LocationBar
          location={location}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isMoving || isSearching}
        />
      </View>
      <View style={controlStyles.controlsContainer}>
        <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
      </View>
    </View>
  );
};

function getPinMode(isSearching: boolean, hasLocation: boolean): PinMode {
  if (isSearching) return 'searching';
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

function useControlPositionsStyle() {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useTheme();

  return useMemo<{[key: string]: ViewStyle}>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding,
        left: theme.sizes.pagePadding,
      },
      positionArrowContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding,
        right: theme.sizes.pagePadding,
      },
      controlsContainer: {
        position: 'absolute',
        bottom: bottom + theme.sizes.pagePadding,
        right: theme.sizes.pagePadding,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding + 28 + theme.sizes.pagePadding,
        paddingHorizontal: theme.sizes.pagePadding,
        width: '100%',
      },
    }),
    [bottom, top],
  );
}

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
  pin: {position: 'absolute', top: -40, right: -20, ...shadows},
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
