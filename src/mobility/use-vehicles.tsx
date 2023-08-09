import {useCallback, useEffect, useState} from 'react';
import {Point} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  MapRegion,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
  VehiclesFilterType,
  VehiclesState,
} from '@atb/components/map';
import {useIsVehiclesEnabled} from '@atb/mobility/use-vehicles-enabled';
import {AreaState, updateAreaState} from '@atb/mobility/utils';
import {getVehicles} from '@atb/api/mobility';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';
import {useVehiclesPollInterval} from '@atb/mobility/use-vehicles-poll-interval';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

const emptyVehicles = toFeatureCollection<Point, VehicleBasicFragment>([]);

function formFactorsFromFilter(
  filter: VehiclesFilterType | undefined,
): FormFactor[] {
  if (!filter) return [FormFactor.Scooter, FormFactor.Bicycle];
  const formFactors = [];
  if (filter.scooters) formFactors.push(FormFactor.Scooter);
  if (filter.bicycles) formFactors.push(FormFactor.Bicycle);
  return formFactors;
}

export const useVehicles: () => VehiclesState | undefined = () => {
  const [area, setArea] = useState<AreaState>();
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

  useEffect(() => {
    if (isFocused) {
      const abort = new AbortController();
      reload('WITH_LOADING', abort);
      return () => abort.abort();
    }
  }, [isFocused]);

  const loadVehicles = useCallback(
    async (signal) => {
      if (isVehiclesEnabled && area && shouldShowVehicles(filter)) {
        return await getVehicles(
          {
            ...area,
            operators: filter?.scooters?.operators,
            formFactors: formFactorsFromFilter(filter),
          },
          {signal},
        )
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

  const updateRegion = async (region: MapRegion) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  };

  const onFilterChange = (filter: VehiclesFilterType) => {
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

const shouldShowVehicles = (filter: VehiclesFilterType | undefined) =>
  filter?.scooters?.showAll || filter?.scooters?.operators.length;
