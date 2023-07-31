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
  MapFilterType,
  MapLeg,
  MapRegion,
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
import {Feature, Point, Position} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {DirectionArrow} from './components/DirectionArrow';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';
import {
  MapState,
  RegionPayload,
} from '@rnmapbox/maps/lib/typescript/components/MapView';
import {useStations} from '@atb/mobility';
import {Stations} from '@atb/components/map';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

export type TravelDetailsMapScreenParams = {
  legs: MapLeg[];
  vehicleWithPosition?: VehicleWithPosition;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  mode?: AnyMode;
  subMode?: AnySubMode;
  mapFilter?: MapFilterType;
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
  mapFilter,
}: Props) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationState();
  const isFocusedAndActive = useIsFocusedAndActive();

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

  const stations = useStations(mapFilter ?? null);

  const [isError, setIsError] = useState(false);

  useLiveVehicleSubscription({
    serviceJourneyId: vehicleWithPosition?.serviceJourney?.id,
    onMessage: (event: WebSocketMessageEvent) => {
      if (isError) setIsError(false);
      const vehicle = JSON.parse(event.data) as VehicleWithPosition;
      setVehicle(vehicle);
    },
    onError: () => setIsError(true),
    enabled: isFocusedAndActive,
  });

  const [shouldTrack, setShouldTrack] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(FOLLOW_ZOOM_LEVEL);
  const [cameraHeading, setCameraHeading] = useState<number>(0);

  /* adding onCameraChanged to <MapView> caused an internal mapbox error in the iOS stage build version, so use the deprecated onRegionIsChanging instead for now and hope the error will be fixed when onRegionIsChanging is removed in the next mapbox version*/
  /* on Android, onRegionIsChanging is very laggy, so use the correct onCameraChanged instead */
  const mapCameraTrackingMethod =
    Platform.OS === 'android'
      ? {
          onCameraChanged: (state: MapboxGL.MapState) => {
            setCameraHeading(state.properties.heading);
            if (state.gestures.isGestureActive) {
              setShouldTrack(false);
            }
          },
        }
      : {
          onRegionIsChanging: (state: Feature<Point, RegionPayload>) => {
            setCameraHeading(state.properties.heading);
            if (state.properties.isUserInteraction) {
              setShouldTrack(false);
            }
          },
        };

  const loadStations = (mapRegion: MapRegion) => {
    stations?.updateRegion(mapRegion);
  };

  const onDidFinishLoadingMap = async () => {
    const visibleBounds = await mapViewRef.current?.getVisibleBounds();
    const zoomLevel = await mapViewRef.current?.getZoom();
    const center = await mapViewRef.current?.getCenter();
    if (!visibleBounds || !zoomLevel || !center) return;
    loadStations({
      visibleBounds,
      zoomLevel,
      center,
    });
  };

  const onMapIdle = (state: MapState) => {
    setZoomLevel(state.properties.zoom);
    loadStations({
      visibleBounds: [state.properties.bounds.ne, state.properties.bounds.sw],
      zoomLevel: state.properties.zoom,
      center: state.properties.center,
    });
  };

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
        pitchEnabled={false}
        {...MapViewConfig}
        {...mapCameraTrackingMethod}
        onMapIdle={onMapIdle}
        onDidFinishLoadingMap={onDidFinishLoadingMap}
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
            zoomLevel={zoomLevel}
            heading={cameraHeading}
            isError={isError}
          />
        )}
        {stations && <Stations stations={stations.stations} />}
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
  zoomLevel: number;
  heading: number;
  isError: boolean;
};

const LiveVehicle = ({
  vehicle,
  setShouldTrack,
  mode,
  subMode,
  zoomLevel,
  heading,
  isError,
}: VehicleIconProps) => {
  const {theme} = useTheme();
  const fillColor = useTransportationColor(mode, subMode, 'background');
  const {live_vehicle_stale_threshold} = useRemoteConfig();

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

  let circleBackgroundColor = circleColor;
  let circleBorderColor = 'transparent';
  if (isError) {
    circleBackgroundColor =
      theme.interactive.interactive_destructive.disabled.background;
    circleBorderColor =
      theme.interactive.interactive_destructive.default.background;
  }
  if (isStale) {
    circleBackgroundColor = theme.interactive.interactive_1.disabled.background;
    circleBorderColor = theme.interactive.interactive_1.default.background;
  }

  if (!vehicle.location || zoomLevel < FOLLOW_MIN_ZOOM_LEVEL) return null;

  const iconBorderWidth = theme.border.width.medium;
  const iconCircleSize = (theme.icon.size.normal + iconBorderWidth) * 2;

  const iconScaleFactor = 2; // fix android transform rendering bugs by scaling up parent and child back down
  const iconSize = iconCircleSize * 0.9 * iconScaleFactor;
  const iconScale = 1 / iconScaleFactor;

  return (
    <MapboxGL.MarkerView
      coordinate={[vehicle.location.longitude, vehicle.location.latitude]}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: iconSize,
          height: iconSize,
        }}
        onTouchStart={() => setShouldTrack(true)}
      >
        <View
          style={{
            position: 'absolute',
            width: iconCircleSize,
            height: iconCircleSize,
            backgroundColor: circleBackgroundColor,
            borderColor: circleBorderColor,
            borderWidth: iconBorderWidth,
            borderRadius: 100,
          }}
        />
        <LiveVehicleIcon
          mode={mode}
          subMode={subMode}
          isError={isError}
          isStale={isStale}
        />

        {!isError &&
          vehicle.bearing !== undefined && ( // only show direction if bearing is defined
            <DirectionArrow
              vehicleBearing={vehicle.bearing}
              heading={heading}
              iconSize={iconSize}
              iconScale={iconScale}
              fill={
                isError
                  ? theme.interactive.interactive_destructive.default.background
                  : isStale
                  ? theme.interactive.interactive_1.default.background
                  : fillColor
              }
            />
          )}
      </View>
    </MapboxGL.MarkerView>
  );
};

type LiveVehicleIconProps = {
  isStale: boolean;
  isError: boolean;
  mode?: AnyMode;
  subMode?: AnySubMode;
};
const LiveVehicleIcon = ({
  mode,
  subMode,
  isStale,
  isError,
}: LiveVehicleIconProps): JSX.Element => {
  const {theme} = useTheme();
  const fillColor = useTransportationColor(mode, subMode, 'text');
  const {svg} = getTransportModeSvg(mode, subMode);

  if (isError)
    return (
      <ThemeIcon
        svg={svg}
        fill={theme.interactive.interactive_destructive.default.background}
        allowFontScaling={false}
      />
    );
  if (isStale)
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
