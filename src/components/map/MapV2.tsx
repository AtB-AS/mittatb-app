import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Geometry, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {
  MapCameraConfig,
  MapViewConfig,
  SLIGHTLY_RAISED_MAP_PADDING,
} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {useAutoSelectMapItem} from './hooks/use-auto-select-map-item';
import {GeofencingZoneCustomProps, MapProps} from './types';

import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isStopPlace,
  isParkAndRide,
  isClusterFeatureV2,
  isQuayFeature,
  mapPositionToCoordinates,
  flyToLocation,
} from './utils';
import {
  GeofencingZones,
  useGeofencingZoneTextContent,
} from '@atb/components/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {
  isBicycleV2,
  isScooterV2,
  isCarStationV2,
  isStationV2,
  isVehiclesClusteredFeature,
} from '@atb/mobility';

import {Snackbar, useSnackbar} from '../snackbar';
import {ShmoTesting} from './components/mobility/ShmoTesting';
import {ScanButton} from './components/ScanButton';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useMapboxJsonStyle} from './hooks/use-mapbox-json-style';
import {NationalStopRegistryFeatures} from './components/national-stop-registry-features';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {VehiclesAndStations} from './components/mobility/VehiclesAndStations';
import {useIsFocused} from '@react-navigation/native';
import {SelectedFeatureIcon} from './components/SelectedFeatureIcon';

export const MapV2 = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const controlStyles = useControlPositionsStyle(false);
  const isFocused = useIsFocused();
  const shouldShowVehiclesAndStations = isFocused; // don't send tile requests while in the background, and always get fresh data upon enter

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const {mapLines, onMapClick, selectedFeature, onReportParkingViolation} =
    useMapSelectionChangeEffect(
      props,
      mapViewRef,
      mapCameraRef,
      startingCoordinates,
      true,
      true,
    );

  const {bottomSheetCurrentlyAutoSelected} = useMapContext();

  const mapboxJsonStyle = useMapboxJsonStyle(shouldShowVehiclesAndStations);

  const aVehicleIsAutoSelected =
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Scooter ||
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Bicycle;

  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {isGeofencingZonesEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  const showGeofencingZones =
    isGeofencingZonesEnabled &&
    (selectedFeatureIsAVehicle || aVehicleIsAutoSelected);

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle || aVehicleIsAutoSelected);

  useAutoSelectMapItem(mapCameraRef, onReportParkingViolation);

  useEffect(() => {
    // hide the snackbar when the bottom sheet is closed
    !selectedFeature && hideSnackbar();
  }, [selectedFeature, hideSnackbar]);

  const geofencingZoneOnPress = useCallback(
    (geofencingZoneCustomProps?: GeofencingZoneCustomProps) => {
      const textContent = getGeofencingZoneTextContent(
        geofencingZoneCustomProps,
      );
      showSnackbar({textContent, position: 'top'});
    },
    [showSnackbar, getGeofencingZoneTextContent],
  );

  /**
   * As setting onPress on the GeofencingZones ShapeSource prevents MapView's onPress
   * from being triggered, the onPress logic is handled here instead.
   * This makes it possible to click directly on e.g. bus stops while GeofencingZones are visible.
   * Step 1: query all rendered features
   * Step 2: decide feature to select
   * Step 3: selected the feature
   */
  const onFeatureClick = useCallback(
    async (feature: Feature) => {
      if (!isFeaturePoint(feature)) return;

      if (!showGeofencingZones) {
        onMapClick({source: 'map-click', feature});
        return;
      }

      const {coordinates: positionClicked} = feature.geometry;

      const featuresAtClick = await getFeaturesAtClick(feature, mapViewRef);
      if (!featuresAtClick || featuresAtClick.length === 0) return;
      const featureToSelect = getFeatureToSelect(
        featuresAtClick,
        positionClicked,
      );

      /**
       * this hides the Snackbar when a feature is clicked,
       * unless the feature is a geofencingZone, in which case
       * geofencingZoneOnPress will be called which sets it visible again
       */
      hideSnackbar();

      if (isQuayFeature(featureToSelect)) {
        // In this case we might want to either
        // - select a stop place with the clicked quay sorted on top
        // - have a bottom sheet with departures just for the clicked quay
        return; // currently - do nothing
      } else if (isFeatureGeofencingZone(featureToSelect)) {
        geofencingZoneOnPress(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );
      } else {
        if (isFeaturePoint(featureToSelect)) {
          onMapClick({
            source: 'map-click',
            feature: featureToSelect,
          });
        } else if (isScooterV2(selectedFeature)) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      hideSnackbar,
      showGeofencingZones,
      onMapClick,
      geofencingZoneOnPress,
      selectedFeature,
    ],
  );

  const onMapItemClick = useCallback(
    async (e: OnPressEvent) => {
      const positionClicked = [e.coordinates.longitude, e.coordinates.latitude];
      const featuresAtClick = e.features;
      if (!featuresAtClick || featuresAtClick.length === 0) return;
      const featureToSelect = getFeatureToSelect(
        featuresAtClick,
        positionClicked,
      );
      if (isClusterFeatureV2(featureToSelect)) {
        const fromZoomLevel = (await mapViewRef.current?.getZoom()) ?? 0;
        const toZoomLevel = Math.max(fromZoomLevel + 2);

        flyToLocation({
          coordinates: mapPositionToCoordinates(
            featureToSelect.geometry.coordinates,
          ),
          padding: SLIGHTLY_RAISED_MAP_PADDING,
          mapCameraRef,
          zoomLevel: toZoomLevel,
          animationDuration: 200,
        });
      } else if (isFeaturePoint(featureToSelect)) {
        if (isQuayFeature(featureToSelect)) return;
        // use isVehicleFeature here?
        onMapClick({
          source: 'map-item',
          feature: featureToSelect,
        });
      }
    },
    [onMapClick],
  );

  // The onPress handling is slow on old android devices with this feature enabled
  const [showSelectedFeature, setShowSelectedFeature] = useState(true);
  const enableShowSelectedFeature = showSelectedFeature; // being considered: setting this to Platform.OS !== 'android'; for temporary performance measure

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onPress={onFeatureClick}
          testID="mapView"
          {...{
            ...MapViewConfig,
            // only updating Map.tsx for now.
            styleURL: undefined,
            styleJSON: mapboxJsonStyle,
          }}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={15}
            centerCoordinate={[
              startingCoordinates.longitude,
              startingCoordinates.latitude,
            ]}
            {...MapCameraConfig}
          />
          {showGeofencingZones && (
            <GeofencingZones
              selectedVehicleId={
                aVehicleIsAutoSelected
                  ? bottomSheetCurrentlyAutoSelected.id
                  : selectedFeature?.properties?.id
              }
            />
          )}

          {mapLines && <MapRoute lines={mapLines} />}

          <NationalStopRegistryFeatures
            selectedFeaturePropertyId={
              enableShowSelectedFeature
                ? selectedFeature?.properties?.id
                : undefined
            }
            onMapItemClick={onMapItemClick}
          />

          {enableShowSelectedFeature && (
            <SelectedFeatureIcon selectedFeature={selectedFeature} />
          )}

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {shouldShowVehiclesAndStations && (
            <VehiclesAndStations
              selectedFeatureId={
                enableShowSelectedFeature
                  ? selectedFeature?.properties?.id
                  : undefined
              }
              onPress={onMapItemClick}
              showVehicles={true}
              showStations={true}
            />
          )}
        </MapboxGL.MapView>
        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
          ]}
        >
          <ExternalRealtimeMapButton onMapClick={onMapClick} />

          <PositionArrow
            onPress={async () => {
              const coordinates = await getCurrentCoordinates(true);
              if (coordinates) {
                onMapClick({
                  source: 'my-position',
                  coords: coordinates,
                });
              }
            }}
          />
        </View>
        {isShmoDeepIntegrationEnabled && (
          <ShmoTesting
            selectedVehicleId={selectedFeature?.properties?.id}
            showSelectedFeature={showSelectedFeature}
            setShowSelectedFeature={setShowSelectedFeature}
          />
        )}
        {showScanButton && <ScanButton />}
        {includeSnackbar && <Snackbar {...snackbarProps} />}
      </View>
    </View>
  );
};

function getFeatureToSelect(
  featuresAtClick: Feature<Geometry, GeoJsonProperties>[],
  positionClicked: Position, // [lon, lat]
) {
  const featureToSelect = featuresAtClick.reduce((selected, currentFeature) =>
    getFeatureWeight(currentFeature, positionClicked) >
    getFeatureWeight(selected, positionClicked)
      ? currentFeature
      : selected,
  );
  return featureToSelect;
}

function getFeatureWeight(feature: Feature, positionClicked: Position): number {
  if (isFeaturePoint(feature)) {
    return isStopPlace(feature) ||
      isVehiclesClusteredFeature(feature) ||
      isScooterV2(feature) ||
      isBicycleV2(feature) ||
      isStationV2(feature) ||
      isCarStationV2(feature) ||
      isParkAndRide(feature)
      ? 3
      : 1;
  } else if (isFeatureGeofencingZone(feature)) {
    const positionClickedIsInsideGeofencingZone = turfBooleanPointInPolygon(
      positionClicked,
      feature.geometry,
    );
    return positionClickedIsInsideGeofencingZone ? 2 : 0;
  } else {
    return 0;
  }
}
