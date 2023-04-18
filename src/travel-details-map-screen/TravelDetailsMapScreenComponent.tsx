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
  // TODO: update name and use parameter
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
  const bounds = getMapBounds(features);

  const {t} = useTranslation();
  const controlStyles = useControlPositionsStyle();
  const vehicles = useGetLiveServiceJourneyVehicles(
    {
      serviceJourneyId: initialVehiclePosition?.serviceJourney?.id,
    },
    initialVehiclePosition,
  );
  console.log(
    initialVehiclePosition?.serviceJourney?.id && vehicles
      ? vehicles.find(
          (v) =>
            v.serviceJourney?.id === initialVehiclePosition.serviceJourney?.id,
        )?.location
      : undefined,
  );

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
      }
    }
  }, [vehicles, followVehicleMapPoint]);

  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView ref={mapViewRef} style={styles.map} {...MapViewConfig}>
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
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
          <MapLabel
            point={pointOf(followVehicleMapPoint)}
            id={'vehicle'}
            text={initialVehiclePosition?.mode ?? 'UNKNOWN'}
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
