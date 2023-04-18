import React, {useCallback, useEffect, useState} from 'react';
import {Feature, FeatureCollection, GeoJSON, Point, Polygon} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  toFeatureCollection,
  toFeaturePoint,
  toFeaturePoints,
} from '@atb/components/map/utils';
import {useIsVehiclesEnabled} from '@atb/mobility/use-vehicles-enabled';
import {
  MapSelectionActionType,
  VehiclesFilterType,
  VehiclesState,
} from '@atb/components/map/types';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {extend, getRadius, isVehicle, needsReload} from '@atb/mobility/utils';
import {ScooterSheet} from '@atb/mobility/components/ScooterSheet';
import {RegionPayload} from '@rnmapbox/maps';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';
import {getVehicles} from '@atb/api/mobility';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';
import {useVehiclesPollInterval} from '@atb/mobility/use-vehicles-poll-interval';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

type VehiclesAndLoadedArea = {
  vehicles: FeatureCollection<Point, VehicleFragment>;
  loadedArea: Feature<Polygon> | undefined;
};
const emptyVehiclesState: VehiclesAndLoadedArea = {
  vehicles: toFeatureCollection([]),
  loadedArea: undefined,
};

export const useVehicles: () => VehiclesState | undefined = () => {
  const [area, setArea] = useState({
    lat: 0,
    lon: 0,
    zoom: 15,
    range: 0,
    visibleBounds: [
      [0, 0],
      [0, 0],
    ],
  });
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const {getMapFilter} = useUserMapFilters();
  const [filter, setFilter] = useState<VehiclesFilterType>();
  const isFocused = useIsFocused();
  const pollInterval = useVehiclesPollInterval();

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.vehicles);
    });
  }, [isVehiclesEnabled]);

  const loadVehicles = useCallback(
    async (
      signal,
      previousState,
      isInitialLoad,
    ): Promise<VehiclesAndLoadedArea> => {
      if (
        isVehiclesEnabled &&
        area.zoom > MIN_ZOOM_LEVEL &&
        filter?.showVehicles
      ) {
        if (
          isInitialLoad &&
          !needsReload(area.visibleBounds, previousState.loadedArea)
        ) {
          return previousState;
        }

        return await getVehicles(area, {signal})
          .then(toFeaturePoints)
          .then(toFeatureCollection)
          .then((vehicles) => ({
            vehicles,
            loadedArea: extend(
              toFeaturePoint(area),
              getRadius(area.visibleBounds, BUFFER_DISTANCE_IN_METERS),
            ),
          }));
      }
      return emptyVehiclesState;
    },
    [area, isVehiclesEnabled, filter],
  );

  const [{vehicles}, reload, isLoading] = usePollableResource(loadVehicles, {
    initialValue: emptyVehiclesState,
    disabled: !isFocused,
    pollingTimeInSeconds: Math.round(pollInterval / 1000),
  });

  const fetchVehicles = async (
    region: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    const zoom = region.properties.zoomLevel;
    const [lon, lat] = region.geometry.coordinates;
    const visibleBounds = region.properties.visibleBounds;
    const range = getRadius(visibleBounds, BUFFER_DISTANCE_IN_METERS);
    setArea({
      lat,
      lon,
      zoom,
      range,
      visibleBounds,
    });
  };

  const onFilterChange = (filter: VehiclesFilterType) => {
    setFilter(filter);
  };

  const onPress = (type: MapSelectionActionType) => {
    if (type.source !== 'map-click') return;
    const vehicle = type.feature.properties;
    if (isVehicle(vehicle)) {
      openBottomSheet(() => (
        <ScooterSheet vehicle={vehicle} close={closeBottomSheet} />
      ));
    }
  };

  return isVehiclesEnabled
    ? {
        vehicles,
        onFilterChange,
        onPress,
        fetchVehicles,
        isLoading,
      }
    : undefined;
};
