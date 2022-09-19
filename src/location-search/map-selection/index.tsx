import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '@atb/components/map';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useReverseGeocoder} from '@atb/geocoder';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import {coordinatesDistanceInMetres} from '@atb/utils/location';
import {Coordinates} from '@entur/sdk';
import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {Feature} from 'geojson';
import React, {useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {LocationSearchScreenProps} from '../types';
import LocationBar from './LocationBar';
import SelectionPin, {PinMode} from './SelectionPin';

/**
 * How many meters from the current location GPS coordinates can the map arrow
 * icon be and still be considered "My position"
 */
const CURRENT_LOCATION_THRESHOLD_METERS = 30;

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoomLevel: number;
  };
};

export type Props = LocationSearchScreenProps<'MapSelection'>;

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

  const {
    closestLocation: location,
    isSearching,
    error,
  } = useReverseGeocoder(centeredCoordinates);

  const {location: geolocation} = useGeolocationState();

  const selectedLocation = useMemo(() => {
    if (!centeredCoordinates) return undefined;
    if (!geolocation) return location;

    const pinIsCloseToGeolocation =
      coordinatesDistanceInMetres(
        geolocation.coordinates,
        centeredCoordinates,
      ) < CURRENT_LOCATION_THRESHOLD_METERS;

    return pinIsCloseToGeolocation ? geolocation : location;
  }, [geolocation, location]);

  const onSelect = () => {
    location &&
      navigation.navigate(callerRouteName as any, {
        [callerRouteParam]: selectedLocation,
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
        [geolocation.coordinates.longitude, geolocation.coordinates.latitude],
        750,
      );
  }

  const flyToFeature = (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
    }
  };

  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View>
        <FullScreenHeader
          title={t(LocationSearchTexts.mapSelection.header.title)}
          leftButton={{type: 'back'}}
        />

        <LocationBar
          location={selectedLocation}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isMoving || isSearching}
          error={error}
        />
      </View>

      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={(region) => {
          setRegionEvent({isMoving: false, region});
        }}
        onRegionWillChange={() =>
          setRegionEvent({isMoving: true, region: regionEvent?.region})
        }
        onPress={flyToFeature}
        {...MapViewConfig}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
          {...MapCameraConfig}
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
      <View style={controlStyles.controlsContainer}>
        <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
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
const useMapStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  pin: {position: 'absolute', top: 40, right: -20, ...shadows},
}));

export default MapSelection;
