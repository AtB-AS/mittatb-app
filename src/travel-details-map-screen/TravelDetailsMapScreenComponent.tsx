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
import {Coordinates} from '@atb/utils/coordinates';
import {MapTexts, useTranslation} from '@atb/translations';
import MapboxGL from '@rnmapbox/maps';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';
import {VehicleWithPosition} from '@atb/api/types/vehicles';
import {useGetLiveServiceJourneyVehicles} from './use-get-live-service-journey-vehicles';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {useTransportationColor} from '@atb/utils/use-transportation-color';

export type TravelDetailsMapScreenParams = {
  legs: MapLeg[];
  vehicleWithPosition?: VehicleWithPosition;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  mode?: TransportMode;
  subMode?: TransportSubmode;
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
  useGetLiveServiceJourneyVehicles(
    setVehicle,
    vehicleWithPosition?.serviceJourney?.id,
  );

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
  mode?: TransportMode;
  subMode?: TransportSubmode;
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
      id="vehicle"
      shape={pointOf(coordinates)}
      cluster
      onPress={() => {
        setShouldTrack(true);
      }}
    >
      <MapboxGL.CircleLayer
        id="icon"
        minZoomLevel={1}
        style={{
          circleColor,
          circleRadius: 22,
        }}
      />
      <MapboxGL.SymbolLayer
        id="transportIcon"
        aboveLayerID="icon"
        minZoomLevel={1}
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

function vehicleIconName(mode?: TransportMode) {
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
