import {VehicleWithPosition} from '@atb/api/types/vehicles';
import {useLiveVehicleSubscription} from '@atb/api/bff/vehicles';
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
  NationalStopRegistryFeatures,
  LocationArrow,
  useControlPositionsStyle,
  useMapViewConfig,
} from '@atb/modules/map';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useThemeContext, StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import {secondsBetween} from '@atb/utils/date';
import {useInterval} from '@atb/utils/use-interval';
import {useTransportColor} from '@atb/utils/use-transport-color';
import MapboxGL, {UserLocationRenderMode} from '@rnmapbox/maps';
import {Feature, Point, Position} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {DirectionArrow} from './components/DirectionArrow';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';

import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {
  MapState,
  RegionPayload,
} from '@rnmapbox/maps/lib/typescript/src/components/MapView';
import {ServiceJourneyPolyline} from '@atb/api/types/serviceJourney';
import {ThemeText} from '@atb/components/text';
import {debugProgressBetweenStopsText} from '../travel-details-screens/utils';
import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {usePreferencesContext} from '@atb/modules/preferences';

export type TravelDetailsMapScreenParams = {
  serviceJourneyPolylines: ServiceJourneyPolyline[];
  vehicleWithPosition?: VehicleWithPosition;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  mode?: AnyMode;
  subMode?: AnySubMode;
  mapFilter?: MapFilterType;
  estimatedCalls?: Array<EstimatedCallWithQuayFragment>;
};

type Props = TravelDetailsMapScreenParams & {
  onPressBack: () => void;
};

const FOLLOW_ZOOM_LEVEL = 14.5;
const FOLLOW_MIN_ZOOM_LEVEL = 8;
const FOLLOW_ANIMATION_DURATION = 500;

export const TravelDetailsMapScreenComponent = ({
  serviceJourneyPolylines,
  vehicleWithPosition,
  toPlace,
  fromPlace,
  onPressBack,
  mode,
  subMode,
  estimatedCalls,
}: Props) => {
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const {location: geolocation} = useGeolocationContext();
  const isFocusedAndActive = useIsFocusedAndActive();
  const [loadedMap, setLoadedMap] = useState(false);
  const {
    preferences: {debugShowProgressBetweenStops},
  } = usePreferencesContext();

  const mapViewConfig = useMapViewConfig();

  const features = useMemo(
    () => createMapLines(serviceJourneyPolylines),
    [serviceJourneyPolylines],
  );
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

  const [liveVehicle, isLiveConnected] = useLiveVehicleSubscription({
    serviceJourneyId: vehicleWithPosition?.serviceJourney?.id,
    vehicleWithPosition,
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

  const onMapIdle = (state: MapState) => {
    setZoomLevel(state.properties.zoom);
  };

  useEffect(() => {
    const location = liveVehicle?.location;
    if (!location) return;
    if (shouldTrack && loadedMap) {
      flyToLocation({
        coordinates: location,
        mapCameraRef,
        mapViewRef,
        animationDuration: FOLLOW_ANIMATION_DURATION,
        animationMode: 'easeTo',
      });
    }
  }, [liveVehicle, loadedMap, shouldTrack]);

  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        pitchEnabled={false}
        {...mapViewConfig}
        {...mapCameraTrackingMethod}
        onMapIdle={onMapIdle}
        onDidFinishLoadingMap={() => setLoadedMap(true)}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          zoomLevel={vehicleWithPosition ? FOLLOW_ZOOM_LEVEL : undefined}
          centerCoordinate={vehicleWithPosition ? centerPosition : undefined}
          animationDuration={0}
        />
        <NationalStopRegistryFeatures
          selectedFeaturePropertyId={undefined}
          onMapItemClick={undefined}
        />

        <MapboxGL.UserLocation
          showsUserHeadingIndicator
          renderMode={UserLocationRenderMode.Native}
        />
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
        {liveVehicle && (
          <LiveVehicleMarker
            vehicle={liveVehicle}
            setShouldTrack={setShouldTrack}
            mode={mode}
            subMode={subMode}
            zoomLevel={zoomLevel}
            heading={cameraHeading}
            isError={isLiveConnected}
          />
        )}
      </MapboxGL.MapView>
      <View style={controlStyles.backArrowContainer}>
        <BackArrow
          accessibilityLabel={t(MapTexts.exitButton.a11yLabel)}
          onBack={onPressBack}
        />
      </View>
      <View
        style={[
          controlStyles.mapButtonsContainer,
          controlStyles.mapButtonsContainerRight,
        ]}
      >
        <LocationArrow
          onPress={() => {
            setShouldTrack(false);
            flyToLocation({
              coordinates: geolocation?.coordinates,
              mapCameraRef,
              mapViewRef,
            });
          }}
        />
      </View>
      {debugShowProgressBetweenStops && liveVehicle && (
        <ThemeText style={{color: 'white', backgroundColor: 'black'}}>
          {debugProgressBetweenStopsText(liveVehicle, estimatedCalls)}
        </ThemeText>
      )}
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

const LiveVehicleMarker = ({
  vehicle,
  setShouldTrack,
  mode,
  subMode,
  zoomLevel,
  heading,
  isError,
}: VehicleIconProps) => {
  const {theme} = useThemeContext();
  const fillColor = useTransportColor(mode, subMode).primary.background;
  const {live_vehicle_stale_threshold} = useRemoteConfigContext();

  const [isStale, setIsStale] = useState(false);

  useInterval(
    () => {
      const secondsSinceUpdate = secondsBetween(
        vehicle.lastUpdated,
        new Date(),
      );
      setIsStale(live_vehicle_stale_threshold < secondsSinceUpdate);
    },
    [vehicle.lastUpdated, live_vehicle_stale_threshold],
    1000,
    false,
    true,
  );

  let circleBackgroundColor = fillColor;
  let circleBorderColor = 'transparent';
  if (isError) {
    circleBackgroundColor =
      theme.color.interactive.destructive.disabled.background;
    circleBorderColor = theme.color.interactive.destructive.default.background;
  }
  if (isStale) {
    circleBackgroundColor = theme.color.interactive[1].disabled.background;
    circleBorderColor = theme.color.interactive[1].default.background;
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
      allowOverlapWithPuck={true}
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
                  ? theme.color.interactive.destructive.default.background
                  : isStale
                    ? theme.color.interactive[1].default.background
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
}: LiveVehicleIconProps): React.JSX.Element => {
  const {theme} = useThemeContext();
  const fillColor = useTransportColor(mode, subMode).primary.foreground.primary;
  const {svg} = getTransportModeSvg(mode, subMode);

  if (isError)
    return (
      <ThemeIcon
        svg={svg}
        color={theme.color.interactive.destructive.default.background}
        allowFontScaling={false}
      />
    );
  if (isStale)
    return (
      <ActivityIndicator
        color={theme.color.interactive[1].disabled.foreground.primary}
      />
    );

  return <ThemeIcon svg={svg} color={fillColor} allowFontScaling={false} />;
};

const useStyles = StyleSheet.createThemeHook(() => ({
  mapView: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
}));
