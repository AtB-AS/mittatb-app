import {SubscriptionState} from '@atb/api';
import {VehicleWithPosition} from '@atb/api/types/vehicles';
import {useLiveVehicleSubscription} from '@atb/api/vehicles';
import {
  AnyMode,
  AnySubMode,
  getTransportModeSvg,
} from '@atb/components/icon-box';
import {
  BackArrow,
  flyToLocation,
  MapCameraConfig,
  MapLeg,
  MapViewConfig,
  PositionArrow,
  useControlPositionsStyle,
} from '@atb/components/map';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useTheme, StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import {secondsBetween} from '@atb/utils/date';
import {useInterval} from '@atb/utils/use-interval';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import MapboxGL from '@rnmapbox/maps';
import {CircleLayerStyleProps} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';
import {BusLiveArrow} from '@atb/assets/svg/mono-icons/navigation';

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
const FOLLOW_MIN_ZOOM_LEVEL = 8;
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
  const styles = useStyles();

  const [vehicle, setVehicle] = useState<VehicleWithPosition | undefined>(
    vehicleWithPosition,
  );

  const {state: subscriptionState} = useLiveVehicleSubscription({
    serviceJourneyId: vehicleWithPosition?.serviceJourney?.id,
    onMessage: (event: WebSocketMessageEvent) => {
      const vehicle = JSON.parse(event.data) as VehicleWithPosition;
      setVehicle(vehicle);
    },
  });

  const [shouldTrack, setShouldTrack] = useState<boolean>(
    !!vehicleWithPosition,
  );
  const [zoomLevel, setZoomLevel] = useState<number>(FOLLOW_ZOOM_LEVEL);
  const [heading, setHeading] = useState<number>(0);

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
        onCameraChanged={(event) => {
          setHeading(event.properties.heading);
          setZoomLevel(event.properties.zoom);
        }}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          zoomLevel={vehicleWithPosition ? FOLLOW_ZOOM_LEVEL : undefined}
          centerCoordinate={vehicleWithPosition ? centerPosition : undefined}
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
        {vehicle && (
          <LiveVehicle
            vehicle={vehicle}
            setShouldTrack={setShouldTrack}
            mode={mode}
            subMode={subMode}
            subscriptionState={subscriptionState}
            zoomLevel={zoomLevel}
            heading={heading}
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

type VehicleIconProps = {
  vehicle: VehicleWithPosition;
  mode?: AnyMode;
  subMode?: AnySubMode;
  setShouldTrack: React.Dispatch<React.SetStateAction<boolean>>;
  subscriptionState: SubscriptionState;
  zoomLevel: number;
  heading: number;
};

const LiveVehicle = ({
  vehicle,
  setShouldTrack,
  mode,
  subMode,
  subscriptionState,
  zoomLevel,
  heading,
}: VehicleIconProps) => {
  const {theme} = useTheme();
  const fillColor = useTransportationColor(mode, subMode, 'background');
  const {live_vehicle_stale_threshold} = useRemoteConfig();

  const isError =
    subscriptionState === 'CLOSING' || subscriptionState === 'CLOSED';
  const isLoading =
    subscriptionState === 'CONNECTING' || subscriptionState === 'NOT_STARTED';
  const [isStale, setIsStale] = useState(false);

  useInterval(
    () => {
      const secondsSinceUpdate = secondsBetween(
        vehicle.lastUpdated,
        new Date(),
      );
      setIsStale(live_vehicle_stale_threshold < secondsSinceUpdate);
    },
    1000,
    [vehicle.lastUpdated],
    false,
    true,
  );

  const circleColor = useTransportationColor(mode, subMode);
  const circleStyle = ((): CircleLayerStyleProps => {
    if (isError)
      return {
        circleColor:
          theme.interactive.interactive_destructive.disabled.background,
        circleRadius: 20,
        circleStrokeColor:
          theme.interactive.interactive_destructive.default.background,
        circleStrokeWidth: 2,
      };
    if (isLoading || isStale)
      return {
        circleColor: theme.interactive.interactive_1.disabled.background,
        circleRadius: 20,
        circleStrokeColor: theme.interactive.interactive_1.default.background,
        circleStrokeWidth: 2,
      };
    return {
      circleColor,
      circleRadius: 22,
      circleStrokeWidth: 0,
    };
  })();

  if (
    !vehicle.location ||
    zoomLevel < FOLLOW_MIN_ZOOM_LEVEL ||
    vehicle.bearing === undefined
  )
    return null;

  const bearingRadians = ((90 - vehicle.bearing + heading) * Math.PI) / 180; // start at 90 degrees, go counter clockwise and convert from degrees to radians
  const directionArrowOffsetFromCenter = 28;

  const iconSize = Platform.OS === 'android' ? 80 : 40; // kinda hacky fix due to lots of android bugs with transform

  return (
    <>
      <MapboxGL.ShapeSource id="liveVehicle" shape={pointOf(vehicle.location)}>
        <MapboxGL.CircleLayer id="liveVehicleCircle" style={circleStyle} />
      </MapboxGL.ShapeSource>
      <MapboxGL.MarkerView
        //id="liveVehicleIcon"
        coordinate={[vehicle.location.longitude, vehicle.location.latitude]}
        //allowOverlap={true}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: iconSize,
            height: iconSize,
          }}
        >
          <TouchableOpacity onPressOut={() => setShouldTrack(true)}>
            <LiveVehicleIcon
              mode={mode}
              subMode={subMode}
              isError={isError}
              isStale={isStale}
              isLoading={isLoading}
            />
          </TouchableOpacity>

          <View
            style={{
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 2,
              position: 'absolute',
              top: -Math.sin(bearingRadians) * directionArrowOffsetFromCenter,
              left: Math.cos(bearingRadians) * directionArrowOffsetFromCenter,
            }}
          >
            <ThemeIcon
              svg={BusLiveArrow}
              fill={
                isError
                  ? theme.interactive.interactive_destructive.default.background
                  : isStale
                  ? theme.interactive.interactive_1.default.background
                  : fillColor
              }
              width={iconSize}
              height={iconSize}
              style={{
                transform: [
                  {rotate: `${vehicle.bearing - heading} deg`},
                  {scale: Platform.OS === 'android' ? 0.5 : 1},
                ],
              }}
            />
          </View>
        </View>
      </MapboxGL.MarkerView>
    </>
  );
};

type LiveVehicleIconProps = {
  isLoading: boolean;
  isStale: boolean;
  isError: boolean;
  mode?: AnyMode;
  subMode?: AnySubMode;
};
const LiveVehicleIcon = ({
  mode,
  subMode,
  isLoading,
  isStale,
  isError,
}: LiveVehicleIconProps): JSX.Element => {
  const {theme} = useTheme();
  const fillColor = useTransportationColor(mode, subMode, 'text');
  const svg = getTransportModeSvg(mode, subMode);

  if (isError)
    return (
      <ThemeIcon
        svg={svg}
        fill={theme.interactive.interactive_destructive.default.background}
        allowFontScaling={false}
      />
    );
  if (isLoading || isStale)
    return (
      <ActivityIndicator
        color={theme.interactive.interactive_1.disabled.text}
      />
    );

  return <ThemeIcon svg={svg} fill={fillColor} allowFontScaling={false} />;
};

const useStyles = StyleSheet.createThemeHook(() => ({
  mapView: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
}));
