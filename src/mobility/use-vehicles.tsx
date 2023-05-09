import React, {useCallback, useEffect, useState} from 'react';
import {GeoJSON, Point} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  MapSelectionActionType,
  toFeatureCollection,
  toFeaturePoints,
  VehiclesFilterType,
  VehiclesState,
  useUserMapFilters,
} from '@atb/components/map';
import {useIsVehiclesEnabled} from '@atb/mobility/use-vehicles-enabled';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {AreaState, isVehicle, updateAreaState} from '@atb/mobility/utils';
import {ScooterSheet} from '@atb/mobility/components/ScooterSheet';
import {RegionPayload} from '@rnmapbox/maps';
import {getVehicles} from '@atb/api/mobility';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';
import {useVehiclesPollInterval} from '@atb/mobility/use-vehicles-poll-interval';
import {useAnalytics} from '@atb/analytics';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

const emptyVehicles = toFeatureCollection<Point, VehicleFragment>([]);

export const useVehicles: () => VehiclesState | undefined = () => {
  const [area, setArea] = useState<AreaState>();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const {getMapFilter} = useUserMapFilters();
  const [filter, setFilter] = useState<VehiclesFilterType>();
  const isFocused = useIsFocused();
  const pollInterval = useVehiclesPollInterval();
  const analytics = useAnalytics();

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.vehicles);
    });
  }, [isVehiclesEnabled]);

  useEffect(() => {
    if (isFocused) {
      const abort = new AbortController();
      reload('WITH_LOADING', abort);
      return () => abort.abort();
    }
  }, [isFocused]);

  const loadVehicles = useCallback(
    async (signal) => {
      if (isVehiclesEnabled && area && filter?.showVehicles) {
        return await getVehicles(area, {signal})
          .then(toFeaturePoints)
          .then(toFeatureCollection);
      }
      return emptyVehicles;
    },
    [area, isVehiclesEnabled, filter],
  );

  const [vehicles, reload, isLoading] = usePollableResource(loadVehicles, {
    initialValue: emptyVehicles,
    disabled: !isFocused,
    pollingTimeInSeconds: Math.round(pollInterval / 1000),
  });

  const updateRegion = async (
    region: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  };

  const onFilterChange = (filter: VehiclesFilterType) => {
    setFilter(filter);
  };

  const onPress = (type: MapSelectionActionType) => {
    if (type.source !== 'map-click') return;
    const vehicle = type.feature.properties;
    if (isVehicle(vehicle)) {
      analytics.logEvent('Scooter selected', {id: vehicle.id});
      openBottomSheet(() => {
        return <ScooterSheet vehicleId={vehicle.id} close={closeBottomSheet} />;
      });
    }
  };

  return isVehiclesEnabled
    ? {
        vehicles,
        onFilterChange,
        onPress,
        updateRegion,
        isLoading,
      }
    : undefined;
};
