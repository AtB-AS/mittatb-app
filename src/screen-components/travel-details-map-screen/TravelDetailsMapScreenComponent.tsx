import {VehicleWithPosition} from '@atb/api/types/vehicles';
import {useLiveVehicleSubscription} from '@atb/api/bff/vehicles';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {
  BackArrow,
  flyToLocation,
  MapCameraConfig,
  MapFilterType,
  NationalStopRegistryFeatures,
  LocationArrow,
  useControlPositionsStyle,
  useMapViewConfig,
  TariffZoneLinesAndLabels,
  mapZonesToPolygonCollection,
} from '@atb/modules/map';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useThemeContext, StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import {secondsBetween} from '@atb/utils/date';
import {useInterval} from '@atb/utils/use-interval';
import MapboxGL, {UserLocationRenderMode} from '@rnmapbox/maps';
import {Expression} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
  Position,
} from 'geojson';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {MapLabel} from './components/MapLabel';
import {MapRoute} from './components/MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';

import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {RegionPayload} from 'node_modules/@rnmapbox/maps/src/components/MapView';
import {ServiceJourneyPolyline} from '@atb/api/types/serviceJourney';
import {ThemeText} from '@atb/components/text';
import {debugProgressBetweenStopsText} from '../travel-details-screens/utils';
import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {usePreferencesContext} from '@atb/modules/preferences';
import {TRANSPORT_SUB_MODES_BOAT} from '@atb/components/icon-box';

export type MapVehicleWithPosition = {
  vehicleWithPosition: VehicleWithPosition;
  mode?: AnyMode;
  subMode?: AnySubMode;
};

export type TravelDetailsMapScreenParams = {
  serviceJourneyPolylines: ServiceJourneyPolyline[];
  vehicles?: MapVehicleWithPosition[];
  /**
   *  Whether the camera should follow the vehicle. If there are multiple
   *  vehicles, the first one is followed.
   */
  followVehicle?: boolean;
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  mapFilter?: MapFilterType;
  estimatedCalls?: Array<EstimatedCallWithQuayFragment>;
};

type Props = TravelDetailsMapScreenParams & {
  onPressBack: () => void;
};

const FOLLOW_ZOOM_LEVEL = 14.5;
const FOLLOW_ANIMATION_DURATION = 500;

// Scale the vehicle markers with the zoom level: small when zoomed far out,
// larger size when zoomed in close.
const iconSizeByZoom: Expression = [
  'interpolate',
  ['linear'],
  ['zoom'],
  9,
  0.5,
  14,
  1.0,
];

export const TravelDetailsMapScreenComponent = ({
  serviceJourneyPolylines,
  vehicles,
  followVehicle,
  toPlace,
  fromPlace,
  onPressBack,
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

  const followSeedLocation = followVehicle
    ? vehicles?.[0]?.vehicleWithPosition.location
    : undefined;
  const bounds = followVehicle ? undefined : getMapBounds(features);
  const centerPosition = followSeedLocation
    ? [followSeedLocation.longitude, followSeedLocation.latitude]
    : undefined;

  const {t, language} = useTranslation();
  const {fareZones} = useFirestoreConfigurationContext();
  const fareZonePolygons = mapZonesToPolygonCollection(fareZones, language);
  const controlStyles = useControlPositionsStyle();
  const styles = useStyles();

  // The live position of the followed vehicle, reported up by its <LiveVehicle>.
  // Only used for camera follow and the debug overlay.
  const [followedVehicle, setFollowedVehicle] = useState<
    VehicleWithPosition | undefined
  >(followVehicle ? vehicles?.[0]?.vehicleWithPosition : undefined);

  const [shouldTrack, setShouldTrack] = useState<boolean>(true);

  /* adding onCameraChanged to <MapView> caused an internal mapbox error in the iOS stage build version, so use the deprecated onRegionIsChanging instead for now and hope the error will be fixed when onRegionIsChanging is removed in the next mapbox version*/
  /* on Android, onRegionIsChanging is very laggy, so use the correct onCameraChanged instead */
  const mapCameraTrackingMethod =
    Platform.OS === 'android'
      ? {
          onCameraChanged: (state: MapboxGL.MapState) => {
            if (state.gestures.isGestureActive) {
              setShouldTrack(false);
            }
          },
        }
      : {
          onRegionIsChanging: (state: Feature<Point, RegionPayload>) => {
            if (state.properties.isUserInteraction) {
              setShouldTrack(false);
            }
          },
        };

  useEffect(() => {
    if (!followVehicle) return;
    const location = followedVehicle?.location;
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
  }, [followVehicle, followedVehicle, loadedMap, shouldTrack]);

  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        pitchEnabled={false}
        {...mapViewConfig}
        {...mapCameraTrackingMethod}
        onDidFinishLoadingMap={() => setLoadedMap(true)}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          bounds={bounds}
          {...MapCameraConfig}
          zoomLevel={followVehicle ? FOLLOW_ZOOM_LEVEL : undefined}
          centerCoordinate={followVehicle ? centerPosition : undefined}
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
        <TariffZoneLinesAndLabels polygonCollection={fareZonePolygons} />
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
        {vehicles?.map((vehicle, index) => (
          <LiveVehicle
            key={vehicle.vehicleWithPosition.serviceJourney?.id ?? index}
            markerId={
              vehicle.vehicleWithPosition.serviceJourney?.id ?? String(index)
            }
            seed={vehicle.vehicleWithPosition}
            mode={vehicle.mode}
            subMode={vehicle.subMode}
            enabled={isFocusedAndActive}
            setShouldTrack={setShouldTrack}
            onLiveUpdate={
              followVehicle && index === 0 ? setFollowedVehicle : undefined
            }
          />
        ))}
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
      {debugShowProgressBetweenStops && followedVehicle && (
        <ThemeText style={{color: 'white', backgroundColor: 'black'}}>
          {debugProgressBetweenStopsText(followedVehicle, estimatedCalls)}
        </ThemeText>
      )}
    </View>
  );
};

type LiveVehicleProps = {
  markerId: string;
  seed: VehicleWithPosition;
  mode?: AnyMode;
  subMode?: AnySubMode;
  enabled: boolean;
  setShouldTrack: React.Dispatch<React.SetStateAction<boolean>>;
  /** Reports the live position up to the parent, e.g. for camera follow. */
  onLiveUpdate?: (vehicle: VehicleWithPosition) => void;
};

const LiveVehicle = ({
  markerId,
  seed,
  mode,
  subMode,
  enabled,
  setShouldTrack,
  onLiveUpdate,
}: LiveVehicleProps) => {
  const [liveVehicle, isLiveConnected] = useLiveVehicleSubscription({
    serviceJourneyId: seed.serviceJourney?.id,
    vehicleWithPosition: seed,
    enabled,
  });

  useEffect(() => {
    if (liveVehicle) onLiveUpdate?.(liveVehicle);
  }, [liveVehicle, onLiveUpdate]);

  if (!liveVehicle) return null;

  return (
    <LiveVehicleMarker
      markerId={markerId}
      vehicle={liveVehicle}
      setShouldTrack={setShouldTrack}
      mode={mode}
      subMode={subMode}
      isError={isLiveConnected}
    />
  );
};

type LiveVehicleMarkerProps = {
  markerId: string;
  vehicle: VehicleWithPosition;
  mode?: AnyMode;
  subMode?: AnySubMode;
  setShouldTrack: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
};

const LiveVehicleMarker = ({
  markerId,
  vehicle,
  setShouldTrack,
  mode,
  subMode,
  isError,
}: LiveVehicleMarkerProps) => {
  const {themeName} = useThemeContext();
  const {live_vehicle_stale_threshold} = useRemoteConfigContext();

  const [isStale, setIsStale] = useState(false);

  const ARROW_OFFSET = 31;

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

  const PointFeatureCollection: FeatureCollection<Point, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            vehicle.location?.longitude ?? 0,
            vehicle.location?.latitude ?? 0,
          ],
        },
        properties: {},
      },
    ],
  };

  const {iconImage, arrowImage} = getVehiclePinSpriteNames(
    isStale,
    isError,
    themeName,
    mode,
    subMode,
  );

  const layers = useMemo<React.ReactElement[]>(() => {
    const result: React.ReactElement[] = [
      <MapboxGL.SymbolLayer
        id={`liveVehicleIcon_${markerId}`}
        key={`liveVehicleIcon_${markerId}`}
        style={{
          iconImage,
          iconSize: iconSizeByZoom,
          iconAllowOverlap: true,
          iconIgnorePlacement: true,
        }}
      />,
    ];

    if (!isError && !isStale && vehicle.bearing != null) {
      result.push(
        <MapboxGL.SymbolLayer
          id={`liveDirectionArrow_${markerId}`}
          key={`liveDirectionArrow_${markerId}`}
          style={{
            iconImage: arrowImage,
            iconSize: iconSizeByZoom,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconRotationAlignment: 'map',
            iconRotate: vehicle.bearing,
            iconOffset: [0, -ARROW_OFFSET],
          }}
        />,
      );
    }

    return result;
  }, [
    markerId,
    vehicle.bearing,
    iconImage,
    arrowImage,
    isError,
    isStale,
    ARROW_OFFSET,
  ]);

  if (!vehicle.location) return null;

  return (
    <MapboxGL.ShapeSource
      id={`liveIconSource_${markerId}`}
      shape={PointFeatureCollection}
      onPress={() => {
        setShouldTrack(true);
      }}
    >
      {layers}
    </MapboxGL.ShapeSource>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  mapView: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
}));

function getVehiclePinSpriteNames(
  isStale: boolean,
  isError: boolean,
  themeName: string,
  mode?: AnyMode,
  subMode?: AnySubMode,
) {
  const activitySpriteString = isError
    ? 'error'
    : isStale
      ? 'loading'
      : 'active';

  const vehicleSpriteString = getTransportModeSpriteName(mode, subMode);

  const iconImage =
    'vehiclepin_' +
    (activitySpriteString === 'loading' ? '' : vehicleSpriteString + '_') +
    activitySpriteString +
    '_' +
    themeName;

  const arrowImage =
    'vehiclepin_' + vehicleSpriteString + '_indicator_' + themeName;

  return {iconImage, arrowImage};
}

function getTransportModeSpriteName(mode?: AnyMode, subMode?: AnySubMode) {
  // Logic here should align with useTransportColor in order to have consistent colors for transport modes

  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'airportLinkBus') return 'otherbus';
      if (subMode === 'localBus') return 'bus';
      return 'regionalbus';
    case 'tram':
      return 'tram';
    case 'metro':
      return 'metro';
    case 'rail':
      if (subMode === 'airportLinkRail') return 'othertrain';
      return 'train';
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? 'boat'
        : 'ferry';
    case 'bicycle':
      return 'citybike';
    case 'car':
      return 'sharedcar';
    case 'scooter':
      return 'scooter';
  }
}
