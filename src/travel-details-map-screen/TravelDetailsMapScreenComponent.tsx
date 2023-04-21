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
import {VehiclePosition} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';
import {useGetLiveServiceJourneyVehicles} from '@atb/travel-details-map-screen/use-get-live-service-journey-vehicles';

export type TravelDetailsMapScreenParams = {
  legs: MapLeg[];
  initialVehiclePosition?: VehiclePosition;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
};

type Props = TravelDetailsMapScreenParams & {
  onPressBack: () => void;
};

export const TravelDetailsMapScreenComponent = ({
  legs,
  initialVehiclePosition,
  toPlace,
  fromPlace,
  onPressBack,
}: Props) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationState();

  const features = useMemo(() => createMapLines(legs), [legs]);
  const bounds = !initialVehiclePosition ? getMapBounds(features) : undefined;
  const centerPosition = initialVehiclePosition?.location
    ? [
        initialVehiclePosition?.location?.longitude,
        initialVehiclePosition?.location?.latitude,
      ]
    : undefined;

  const {t} = useTranslation();
  const controlStyles = useControlPositionsStyle();
  const vehicles = useGetLiveServiceJourneyVehicles(initialVehiclePosition);
  const [shouldTrack, setShouldTrack] = useState<boolean>(true);

  const [followVehicleMapPoint, setFollowVehicleMapPoint] = useState<
    Coordinates | undefined
  >(undefined);

  useEffect(() => {
    if (initialVehiclePosition?.serviceJourney?.id) {
      const vehicle = vehicles.find(
        (v) =>
          v.serviceJourney?.id === initialVehiclePosition.serviceJourney?.id,
      );
      if (vehicle && vehicle !== followVehicleMapPoint) {
        setFollowVehicleMapPoint(vehicle.location);
        if (shouldTrack) {
          flyToLocation({
            coordinates: vehicle.location,
            mapCameraRef,
            zoomLevel: 13.5,
            animationDuration: 400,
          });
        }
      }
    }
  }, [vehicles, followVehicleMapPoint, shouldTrack]);

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
          zoomLevel={13.5}
          centerCoordinate={centerPosition}
          animationDuration={0}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <MapRoute lines={features} />
        {toPlace && (
          <MapLabel
            point={pointOf(toPlace)}
            id={'end'}
            text={t(MapTexts.endPoint.label)}
          />
        )}
        {fromPlace && (
          <MapLabel
            point={pointOf(fromPlace)}
            id={'start'}
            text={t(MapTexts.startPoint.label)}
          />
        )}
        {followVehicleMapPoint && (
          <LiveVehicle
            vehicles={followVehicleMapPoint}
            setShouldTrack={setShouldTrack}
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
  vehicles: Coordinates;
  setShouldTrack: React.Dispatch<React.SetStateAction<boolean>>;
};

const LiveVehicle = ({vehicles, setShouldTrack}: VehicleIconProps) => {
  const shapeSource = useRef<MapboxGL.ShapeSource>(null);

  if (!vehicles) return null;
  return (
    <MapboxGL.ShapeSource
      id={'vehicle'}
      ref={shapeSource}
      shape={pointOf(vehicles)}
      cluster
      onPress={() => {
        setShouldTrack(true);
      }}
    >
      <MapboxGL.SymbolLayer
        id="icon"
        minZoomLevel={1}
        style={{
          iconImage: {uri: 'ClusterCount'},
          iconSize: 2,
          iconAllowOverlap: true,
          iconTranslate: [13, -13],
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterCount"
        minZoomLevel={1}
        aboveLayerID="icon"
        style={{
          textField: 'BUS',
          textColor: 'black',
          textSize: 11,
          textTranslate: [13, -13],
          textAnchor: 'center',
          textAllowOverlap: true,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
