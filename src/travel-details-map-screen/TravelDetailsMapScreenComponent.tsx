import {TransportMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {VehicleWithPosition} from '@atb/api/types/vehicles';
import {useLiveVehicleSubscription} from '@atb/api/vehicles';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {
  BackArrow,
  flyToLocation,
  MapCameraConfig,
  MapLeg,
  MapViewConfig,
  PositionArrow,
  useControlPositionsStyle,
} from '@atb/components/map';
import {useGeolocationState} from '@atb/GeolocationContext';
import {MapTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import MapboxGL from '@rnmapbox/maps';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';

export type TravelDetailsMapScreenParams = {
  legs: MapLeg[];
  vehicleWithPosition?: VehicleWithPosition;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  mode?: AnyMode;
  subMode?: AnySubMode;
};

type Props = TravelDetailsMapScreenParams & {
  onPressBack: () => void;
};

const FOLLOW_ZOOM_LEVEL = 14.5;
const FOLLOW_ANIMATION_DURATION = 500;

export const TravelDetailsMapScreenComponent = ({
  legs,
  vehicleWithPosition,
  toPlace,
  fromPlace,
  onPressBack,
  mode,
  subMode,
}: Props) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationState();

  const features = useMemo(() => createMapLines(legs), [legs]);
  const bounds = !vehicleWithPosition ? getMapBounds(features) : undefined;
  const centerPosition = vehicleWithPosition?.location
    ? [
        vehicleWithPosition?.location?.longitude,
        vehicleWithPosition?.location?.latitude,
      ]
    : undefined;

  const {t} = useTranslation();
  const controlStyles = useControlPositionsStyle();

  const [vehicle, setVehicle] = useState<VehicleWithPosition | undefined>(
    vehicleWithPosition,
  );

  useLiveVehicleSubscription({
    serviceJourneyId: vehicleWithPosition?.serviceJourney?.id,
    onMessage: (event: WebSocketMessageEvent) => {
      const vehicle = JSON.parse(event.data) as VehicleWithPosition;
      setVehicle(vehicle);
    },
  });

  const [shouldTrack, setShouldTrack] = useState<boolean>(true);

  useEffect(() => {
    const location = vehicle?.location;
    if (!location) return;
    if (shouldTrack) {
      flyToLocation({
        coordinates: location,
        mapCameraRef,
        animationDuration: FOLLOW_ANIMATION_DURATION,
        animationMode: 'easeTo',
      });
    }
  }, [vehicle, shouldTrack]);

  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        {...MapViewConfig}
        onTouchMove={() => {
          setShouldTrack(false);
        }}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          zoomLevel={FOLLOW_ZOOM_LEVEL}
          centerCoordinate={centerPosition}
          animationDuration={0}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <MapRoute lines={features} />
        {toPlace && (
          <MapLabel
            point={pointOf(toPlace)}
            id="end"
            text={t(MapTexts.endPoint.label)}
          />
        )}
        {fromPlace && (
          <MapLabel
            point={pointOf(fromPlace)}
            id="start"
            text={t(MapTexts.startPoint.label)}
          />
        )}
        {vehicle?.location && (
          <LiveVehicle
            coordinates={vehicle.location}
            setShouldTrack={setShouldTrack}
            mode={mode}
            subMode={subMode}
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
            flyToLocation({
              coordinates: geolocation?.coordinates,
              mapCameraRef,
            });
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mapView: {flex: 1},
  map: {flex: 1},
});

type VehicleIconProps = {
  coordinates: Coordinates;
  mode?: AnyMode;
  subMode?: AnySubMode;
  setShouldTrack: React.Dispatch<React.SetStateAction<boolean>>;
};

const LiveVehicle = ({
  coordinates,
  setShouldTrack,
  mode,
  subMode,
}: VehicleIconProps) => {
  const circleColor = useTransportationColor(mode, subMode);
  const iconName = vehicleIconName(mode);

  if (!coordinates) return null;
  return (
    <MapboxGL.ShapeSource
      id="liveVehicle"
      shape={pointOf(coordinates)}
      cluster
      onPress={() => {
        setShouldTrack(true);
      }}
    >
      <MapboxGL.CircleLayer
        id="liveVehicleCircle"
        minZoomLevel={8}
        style={{
          circleColor,
          circleRadius: 22,
        }}
      />
      <MapboxGL.SymbolLayer
        id="liveVehicleIcon"
        aboveLayerID="liveVehicleCircle"
        minZoomLevel={8}
        style={{
          iconImage: {uri: iconName},
          iconAnchor: 'center',
          iconAllowOverlap: true,
          iconSize: 0.6,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

/**
 * Get the name of the transportation mode icon which is stored under the
 * "Images" section in Mapbox Studio.
 */
function vehicleIconName(mode?: AnyMode) {
  switch (mode) {
    case TransportMode.Bus:
      return 'Bus';
    case TransportMode.Tram:
      return 'Tram';
    case TransportMode.Water:
      return 'Boat';
    case TransportMode.Rail:
      return 'Train';
    case TransportMode.Metro:
      return 'Subway';
    default:
      return 'Unknown';
  }
}
