import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '@atb/components/map/index';
import {useReverseGeocoder} from '@atb/geocoder';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {Coordinates} from '@entur/sdk';
import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {Feature} from 'geojson';
import React, {useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {coordinatesDistanceInMetres} from '@atb/utils/location';
import SelectionPin, {PinMode} from '@atb/components/map/SelectionPin';
import LocationBar from '@atb/components/map/LocationBar';
import {tripsSearch} from '@atb/api/trips_v2';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {createMapLines} from '@atb/screens/TripDetails/Map/utils';

/**
 * How many meters from the current location GPS coordinates can the map arrow
 * icon be and still be considered "My position"
 */
const CURRENT_LOCATION_THRESHOLD_METERS = 30;
const MAX_LIMIT_TO_SHOW_WALKING_TRIP_PATTERN = 5000;

type RegionEvent = {
  isMoving: boolean;
  region?: GeoJSON.Feature<GeoJSON.Point, RegionPayload>;
};

type MapProps = {
  coordinates: Coordinates & {zoomLevel: number};
  shouldShowSearchBar?: boolean;
  shouldShowSelectionPin?: boolean;
  shouldExploreTripOptions?: boolean;
  shouldFlyToSelectedPoints?: boolean;
  onLocationSelect?: (selectedLocation?: any) => void;
};

const Map = ({
  coordinates,
  shouldShowSearchBar,
  shouldShowSelectionPin,
  shouldExploreTripOptions,
  shouldFlyToSelectedPoints,
  onLocationSelect,
}: MapProps) => {
  const [regionEvent, setRegionEvent] = useState<RegionEvent>();
  const [tripLegs, setTripLegs] = useState<any>();
  const mapLines = tripLegs ? createMapLines(tripLegs) : [];
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
    if (location && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
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

  const onPointSelect = async (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      if (shouldExploreTripOptions) {
        await findTripToSelectedLocation(feature);
      } else if (shouldFlyToSelectedPoints) {
        mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
      }
    }
  };
  async function findTripToSelectedLocation(feature: any) {
    const selectedCoordinates = {
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    };

    const currentLocationCoordinates = {
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    };
    const {screenPointX, screenPointY} = feature.properties;
    const featuresAtPoint =
      await mapViewRef?.current?.queryRenderedFeaturesAtPoint(
        [screenPointX, screenPointY],
        ['==', ['geometry-type'], 'Point'],
      );

    featuresAtPoint?.features.map(async (featureAtPoint) => {
      if (featureAtPoint?.properties?.entityType === 'StopPlace') {
        setTripLegs([]);
        mapCameraRef.current?.fitBounds(
          [
            currentLocationCoordinates.longitude,
            currentLocationCoordinates.latitude,
          ],
          feature.geometry.coordinates,
          [50, 50],
          1000,
        );

        const trips = await getTrips(
          currentLocationCoordinates,
          selectedCoordinates,
        );

        // can entur return more than one walking pattern between two stops?
        const walkingTripPattern = trips?.trip.tripPatterns.find(
          (tp) => tp.legs.length === 1 && tp.legs[0].mode === 'foot',
        );
        if (
          walkingTripPattern &&
          (walkingTripPattern.walkDistance as number) <=
            MAX_LIMIT_TO_SHOW_WALKING_TRIP_PATTERN
        ) {
          setTripLegs(walkingTripPattern.legs);
        }
      }
    });
  }

  const getTrips = async (
    fromCoordinates: Coordinates,
    toCoordinates: Coordinates,
  ) => {
    return await tripsSearch({
      from: {
        name: 'From Position',
        coordinates: fromCoordinates,
      },
      to: {
        name: 'To Position',
        coordinates: toCoordinates,
      },
      arriveBy: false,
    });
  };

  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  return (
    <View style={styles.container}>
      {shouldShowSearchBar && (
        <LocationBar
          location={selectedLocation}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isMoving || isSearching}
          error={error}
        />
      )}
      <View style={{flex: 1}}>
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
          onPress={onPointSelect}
          {...MapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={coordinates.zoomLevel}
            centerCoordinate={[coordinates.longitude, coordinates.latitude]}
            {...MapCameraConfig}
          />
          {mapLines && <MapRoute lines={mapLines}></MapRoute>}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
        {shouldShowSelectionPin && (
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
        )}
        <View style={controlStyles.controlsContainer}>
          <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
          <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
        </View>
      </View>
    </View>
  );
};

function getPinMode(isSearching: boolean, hasLocation: boolean): PinMode {
  if (isSearching) return 'searching';
  if (hasLocation) return 'found';

  return 'nothing';
}
const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {position: 'absolute', ...shadows},
}));

export default Map;
