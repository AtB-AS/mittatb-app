import {useCallback, useEffect, useState} from 'react';
import {Point} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  MapRegion,
  MobilityMapFilterType,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
  VehicleFeatures,
  VehiclesState,
} from '@atb/components/map';
import {useIsVehiclesEnabled} from '@atb/mobility/use-vehicles-enabled';
import {
  AreaState,
  getOperators,
  isShowAll,
  updateAreaState,
} from '@atb/mobility/utils';
import {getVehicles} from '@atb/api/mobility';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';
import {useVehiclesPollInterval} from '@atb/mobility/use-vehicles-poll-interval';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

const emptyCollection = toFeatureCollection<Point, VehicleBasicFragment>([]);
const emptyVehicles: VehicleFeatures = {
  bicycles: emptyCollection,
  scooters: emptyCollection,
};

export const useVehicles: (
  initialFilter?: MobilityMapFilterType,
) => VehiclesState | undefined = (initialFilter) => {
  const [area, setArea] = useState<AreaState>();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const {getMapFilter} = useUserMapFilters();
  const [filter, setFilter] = useState<MobilityMapFilterType>(
    initialFilter ?? {},
  );
  const isFocused = useIsFocused();
  const pollInterval = useVehiclesPollInterval();

  useEffect(() => {
    getMapFilter().then((userFilter) => {
      setFilter(userFilter.mobility);
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
      if (isVehiclesEnabled && area) {
        const scooterOperators = getOperators(filter, FormFactor.Scooter);
        const includeScooters =
          isShowAll(filter, FormFactor.Scooter) || scooterOperators.length > 0;
        const bicycleOperators = getOperators(filter, FormFactor.Bicycle);
        const includeBicycles =
          isShowAll(filter, FormFactor.Bicycle) || bicycleOperators.length > 0;
        if (
          includeBicycles ||
          includeScooters ||
          bicycleOperators.length > 0 ||
          scooterOperators.length > 0
        ) {
          return await getVehicles(
            {
              ...area,
              scooterOperators,
              includeScooters,
              bicycleOperators,
              includeBicycles,
            },
            {signal},
          ).then((vehicles) => ({
            bicycles: vehicles.bicycles
              ? toFeatureCollection(toFeaturePoints(vehicles.bicycles))
              : emptyCollection,
            scooters: vehicles.scooters
              ? toFeatureCollection(toFeaturePoints(vehicles.scooters))
              : emptyCollection,
          }));
        }
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

  const updateRegion = async (region: MapRegion) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  };

  const onFilterChange = (filter: MobilityMapFilterType) => {
    setFilter(filter);
  };

  return isVehiclesEnabled
    ? {
        vehicles,
        onFilterChange,
        updateRegion,
        isLoading,
      }
    : undefined;
};
