import {
  getCurrentCoordinatesGlobal,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {StyleSheet} from '@atb/theme';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import MapboxGL, {LocationPuck, MapState} from '@rnmapbox/maps';
import {Feature, Polygon, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {polygon} from '@turf/helpers';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {SelectionPin} from './components/SelectionPin';
import {LocationBar} from './components/LocationBar';
import {PositionArrow} from './components/PositionArrow';
import {MapFilter} from './components/filter/MapFilter';
import {Stations, Vehicles} from './components/mobility';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {useAutoSelectMapItem} from './hooks/use-auto-select-map-item';
import {GeofencingZoneCustomProps, MapProps, MapRegion} from './types';

//import {MapPin} from '../../assets/svg/mono-icons/map';
// import TestImg from './TestImg.png';
// import AndroidIcon from './AndroidIcon.jpg';
// import ParkingIcon from './Parking.png';

// const mapIcons2 = {
//   Park_and_ride: require('./sprite_images/Mapbox-Park_and_ride.svg'),
//   Ferry: require('./sprite_images/Mapbox-Ferry.svg'),
//   Tram: require('./sprite_images/Mapbox-Tram.svg'),
//   TramSubway: require('./sprite_images/Mapbox-TramSubway.svg'),
//   Subway: require('./sprite_images/Mapbox-Subway.svg'),
//   Carferry: require('./sprite_images/Mapbox-Carferry.svg'),
//   Helicopter: require('./sprite_images/Mapbox-Helicopter.svg'),
//   Train: require('./sprite_images/Mapbox-Train.svg'),
//   BusTram: require('./sprite_images/Mapbox-BusTram.svg'),
//   Plane: require('./sprite_images/Mapbox-Plane.svg'),
//   Bus: require('./icons/Bus.png'),
//   BusSelected: require('./icons/BusSelected.png'),
// }

import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isStopPlace,
  isParkAndRide,
} from './utils';
import isEqual from 'lodash.isequal';
import {
  GeofencingZones,
  useGeofencingZoneTextContent,
} from '@atb/components/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {isBicycle, isScooter} from '@atb/mobility';
import {isCarStation, isStation} from '@atb/mobility/utils';

import {Snackbar, useSnackbar} from '../snackbar';
import {ShmoTesting} from './components/mobility/ShmoTesting';
import {ScanButton} from './components/ScanButton';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {useFeatureToggles} from '@atb/feature-toggles';

//import {ShmoTesting} from './components/mobility/ShmoTesting';
import {
  mapIcons,
  mapStyleItemToCircleStyle,
  mapStyleItemToSymbolStyle,
  //mapStyleToSymbolOrCircle,
  nsrStyleCircleItems,
  //nsrStyleItems,
  nsrStyleSymbolItems,
} from './nsrItemsMapStyle';
//import {iconSizes} from '@atb-as/theme';

export const Map = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle(
    props.selectionMode === 'ExploreLocation',
  );

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const {
    mapLines,
    selectedCoordinates,
    onMapClick,
    selectedFeature,
    onReportParkingViolation,
  } = useMapSelectionChangeEffect(
    props,
    mapViewRef,
    mapCameraRef,
    startingCoordinates,
  );

  const {bottomSheetCurrentlyAutoSelected} = useMapState();

  const aVehicleIsAutoSelected =
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Scooter ||
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Bicycle;

  const selectedFeatureIsAVehicle =
    isScooter(selectedFeature) || isBicycle(selectedFeature);

  const {isGeofencingZonesEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureToggles();

  const showGeofencingZones =
    isGeofencingZonesEnabled &&
    (selectedFeatureIsAVehicle || aVehicleIsAutoSelected);

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    props.selectionMode === 'ExploreEntities' &&
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

  const updateRegionForVehicles = props.vehicles?.updateRegion;
  const updateRegionForStations = props.stations?.updateRegion;
  const [mapRegion, setMapRegion] = useState<MapRegion>();
  useEffect(() => {
    if (!mapRegion) return;
    updateRegionForVehicles?.(mapRegion);
    updateRegionForStations?.(mapRegion);
  }, [mapRegion, updateRegionForVehicles, updateRegionForStations]);

  const onDidFinishLoadingMap = async () => {
    const visibleBounds = await mapViewRef.current?.getVisibleBounds();
    const zoomLevel = await mapViewRef.current?.getZoom();
    const center = await mapViewRef.current?.getCenter();

    if (!visibleBounds || !zoomLevel || !center) return;

    setMapRegion({
      visibleBounds,
      zoomLevel,
      center,
    });
  };

  /**
   * OnMapIdle fires more often than expected, because of that we check if the
   * map region is changed before updating its state.
   *
   * There is a slight performance overhead by deep comparing previous and new
   * map regions on each on map idle, but since we have control over the size of
   * the objects it should be ok. The risk of firing effects that uses the map
   * region too often is greater than the risk introduced by the performance
   * overhead.
   */
  const onMapIdle = (state: MapState) => {
    const newMapRegion: MapRegion = {
      visibleBounds: [state.properties.bounds.ne, state.properties.bounds.sw],
      zoomLevel: state.properties.zoom,
      center: state.properties.center,
    };
    setMapRegion((prevMapRegion) =>
      isEqual(prevMapRegion, newMapRegion) ? prevMapRegion : newMapRegion,
    );
  };

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

      mapViewRef.current?.clearData(); // refreshes style
      if (!showGeofencingZones) {
        onMapClick({source: 'map-click', feature});
        return;
      }

      const {coordinates: positionClicked} = feature.geometry;

      const featuresAtClick = await getFeaturesAtClick(feature, mapViewRef);
      if (!featuresAtClick || featuresAtClick.length === 0) return;
      const featureToSelect = featuresAtClick.reduce(
        (selected, currentFeature) =>
          getFeatureWeight(currentFeature, positionClicked) >
          getFeatureWeight(selected, positionClicked)
            ? currentFeature
            : selected,
      );

      /**
       * this hides the Snackbar when a feature is clicked,
       * unless the feature is a geofencingZone, in which case
       * geofencingZoneOnPress will be called which sets it visible again
       */
      hideSnackbar();

      if (isFeatureGeofencingZone(featureToSelect)) {
        geofencingZoneOnPress(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );
      } else {
        if (isFeaturePoint(featureToSelect)) {
          onMapClick({
            source: 'map-click',
            feature: featureToSelect,
          });
        } else if (isScooter(selectedFeature)) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      geofencingZoneOnPress,
      hideSnackbar,
      onMapClick,
      showGeofencingZones,
      selectedFeature,
    ],
  );

  //const featureEntityType = ['get', 'entityType'];
  //const featureStopPlaceType = ['get', 'stopPlaceType'];
  ////const featureId = ['get', 'id'];

  const selectedFeatureId = selectedFeature?.properties?.id || '';
  //const isSelected = ['==', featureId, selectedFeatureId];
  // const [refreshKey, setRefreshKey] = useState('someKey');
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('SET THE KEY');
  //     setRefreshKey('anotherKey');
  //   }, 5000);
  // }, []);

  return (
    <View style={styles.container}>
      {props.selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates || startingCoordinates}
          onSelect={props.onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          onMapIdle={onMapIdle}
          onPress={onFeatureClick}
          testID="mapView"
          {...MapViewConfig}
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
          <MapboxGL.Images images={mapIcons} />

          <MapboxGL.VectorSource
            id="stop-places-source"
            url="mapbox://mittatb.3hi4kb3o"
            //key={refreshKey}
            // minZoomLevel={14} // limit requests to zoom level
            // maxZoomLevel={14} // limit requests to zoom level
            //tileUrlTemplates={[`localhost:8082/${refreshKey}/{z}/{x}/{y}.pbf`]}
          >
            <>
              {nsrStyleSymbolItems.map((nsrStyleSymbolItem) => (
                <MapboxGL.SymbolLayer
                  key={nsrStyleSymbolItem.id}
                  id={nsrStyleSymbolItem.id}
                  //maxZoomLevel={10}
                  sourceID="composite"
                  //sourceLayerID="foo-6pzjnl"
                  sourceLayerID={nsrStyleSymbolItem['source-layer']}
                  // Filter to include relevant entity types
                  filter={nsrStyleSymbolItem.filter}
                  style={mapStyleItemToSymbolStyle(
                    nsrStyleSymbolItem,
                    selectedFeatureId,
                  )}
                />
              ))}
              {nsrStyleCircleItems.map((nsrStyleCircleItem) => (
                <MapboxGL.CircleLayer
                  key={nsrStyleCircleItem.id}
                  id={nsrStyleCircleItem.id}
                  sourceID="composite"
                  sourceLayerID={nsrStyleCircleItem['source-layer']} // Make sure to access source-layer dynamically
                  filter={nsrStyleCircleItem.filter}
                  style={mapStyleItemToCircleStyle(nsrStyleCircleItem)} // Apply the mapped circle style
                  minZoomLevel={nsrStyleCircleItem.minzoom || 0} // Optional: minZoom level from item
                />
              ))}
            </>
          </MapboxGL.VectorSource>

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
          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {props.selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <SelectionPin coordinates={selectedCoordinates} id="selectionPin" />
          )}
          {props.vehicles && (
            <Vehicles
              vehicles={props.vehicles.vehicles}
              mapCameraRef={mapCameraRef}
              mapViewRef={mapViewRef}
              onClusterClick={(feature) => {
                onMapClick({
                  source: 'cluster-click',
                  feature,
                });
              }}
            />
          )}
          {props.stations && (
            <Stations
              stations={props.stations.stations}
              mapCameraRef={mapCameraRef}
              onClusterClick={(feature) => {
                onMapClick({
                  source: 'cluster-click',
                  feature,
                });
              }}
            />
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          <ExternalRealtimeMapButton onMapClick={onMapClick} />

          {(props.vehicles || props.stations) && (
            <MapFilter
              onPress={() => onMapClick({source: 'filters-button'})}
              isLoading={
                (props.vehicles?.isLoading || props.stations?.isLoading) ??
                false
              }
            />
          )}
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
          <ShmoTesting selectedVehicleId={selectedFeature?.properties?.id} />
        )}
        {showScanButton && <ScanButton />}
        {includeSnackbar && <Snackbar {...snackbarProps} />}
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));

function getFeatureWeight(feature: Feature, positionClicked: Position): number {
  if (isFeaturePoint(feature)) {
    return isStopPlace(feature) ||
      isScooter(feature) ||
      isBicycle(feature) ||
      isStation(feature) ||
      isCarStation(feature) ||
      isParkAndRide(feature)
      ? 3
      : 1;
  } else if (isFeatureGeofencingZone(feature)) {
    const coordinates = (feature.geometry as Polygon).coordinates;
    const polygonGeometry = polygon(coordinates);
    const positionClickedIsInsidePolygon = turfBooleanPointInPolygon(
      positionClicked,
      polygonGeometry,
    );
    return positionClickedIsInsidePolygon ? 2 : 0;
  } else {
    return 0;
  }
}

// (entity_type, stop_place_type, finalStopPlaceType)

// ('TariffZone', None, None)
// ('Quay', None, None)
// ('Parking', None, None)

// ('StopPlace', None, None)

// ('StopPlace', 'onstreetBus', 'onstreetBus')
// ('StopPlace', 'onstreetBus', 'onstreetBus_onstreetTram')
// ('StopPlace', 'onstreetBus', 'localBus')
// ('StopPlace', 'onstreetBus', 'localBus_onstreetTram')
// ('StopPlace', 'onstreetBus', 'localTram_onstreetBus')

// ('StopPlace', 'onstreetBus', 'schoolBus')
// ('StopPlace', 'onstreetBus', 'regionalBus')
// ('StopPlace', 'onstreetBus', 'shuttleBus')
// ('StopPlace', 'onstreetBus', 'expressBus')
// ('StopPlace', 'onstreetBus', 'railReplacementBus')
// ('StopPlace', 'onstreetBus', 'airportLinkBus')
// ('StopPlace', 'onstreetBus', 'sightseeingBus')

// ('StopPlace', 'harbourPort', 'localCarFerry')
// ('StopPlace', 'harbourPort', 'nationalCarFerry')
// ('StopPlace', 'harbourPort', 'internationalCarFerry')
// ('StopPlace', 'harbourPort', 'highSpeedPassengerService')
// ('StopPlace', 'harbourPort', 'highSpeedVehicleService')
// ('StopPlace', 'harbourPort', 'harbourPort')

// ('StopPlace', 'onstreetTram', 'onstreetTram')
// ('StopPlace', 'onstreetTram', 'localTram')
// ('StopPlace', 'onstreetTram', 'localTram_onstreetBus')
// ('StopPlace', 'onstreetTram', 'localTram_metroStation')
// ('StopPlace', 'onstreetTram', 'onstreetBus_onstreetTram')

// ('StopPlace', 'ferryStop', 'sightseeingService')
// ('StopPlace', 'ferryStop', 'highSpeedPassengerService')
// ('StopPlace', 'ferryStop', 'localPassengerFerry')
// ('StopPlace', 'ferryStop', 'ferryStop')

// ('StopPlace', 'liftStation', 'liftStation')
// ('StopPlace', 'liftStation', 'telecabin')

// ('StopPlace', 'airport', 'airport')
// ('StopPlace', 'airport', 'helicopterService')

// ('StopPlace', 'metroStation', 'metroStation')
// ('StopPlace', 'metroStation', 'metro')

// ('StopPlace', 'railStation', 'railStation')
// ('StopPlace', 'railStation', 'touristRailway')

// ('StopPlace', 'busStation', 'busStation')

// https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/728727661/stops#StopPlace.1
// stop_place_type:
// onstreetBus (bus stops)
// onstreetTram (tram stops)
// taxiStand (taxi stations)
// airport (airports)
// railStation (railway stations)
// metroStation (metro or subway stations)
// busStation (bus terminals (different from regular bus stops))
// harbourPort (ports where cars may board or disembark a ship)
// ferryStop (ports where people can board or disembark a ship)
// liftStation (station for a cable borne vehicle)
// --
// Mandatory when StopPlace has one or more subordinate Quay.
// Not mandatory if the StopPlace is a parentStop.
