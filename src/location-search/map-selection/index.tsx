import {Coordinates} from '@entur/sdk';
import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {RouteProp} from '@react-navigation/native';
import {Feature} from 'geojson';
import React, {useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {LocationSearchNavigationProp, LocationSearchStackParams} from '../';
import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '../../components/map/';
import {useReverseGeocoder} from '../../geocoder';
import {useGeolocationState} from '../../GeolocationContext';
import FullScreenHeader from '../../ScreenHeader/full-header';
import {StyleSheet} from '../../theme';
import LocationBar from './LocationBar';
import SelectionPin, {PinMode} from './SelectionPin';
import {LocationSearchTexts, useTranslation} from '../../translations';

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

  const {closestLocation: location, isSearching, error} = useReverseGeocoder(
    centeredCoordinates,
  );

  const {location: geolocation} = useGeolocationState();

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
          location={location}
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
        onRegionDidChange={(region) =>
          setRegionEvent({isMoving: false, region})
        }
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
