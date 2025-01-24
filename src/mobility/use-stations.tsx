import {useCallback, useEffect, useMemo, useState} from 'react';
import {AreaState, getOperators, isShowAll, updateAreaState} from './utils';
import {
  MapRegion,
  MobilityMapFilterType,
  StationFeatures,
  StationsState,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
} from '@atb/components/map';
import {Point} from 'geojson';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {useIsFocused} from '@react-navigation/native';
import {getStations} from '@atb/api/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

const MIN_ZOOM_LEVEL = 11;
const BUFFER_DISTANCE_IN_METERS = 500;

const emptyCollection = toFeatureCollection<Point, StationBasicFragment>([]);
const emptyStations: StationFeatures = {
  bicycles: emptyCollection,
  cars: emptyCollection,
};

export const useStations: (
  initialFilter?: MobilityMapFilterType,
) => StationsState | undefined = (initialFilter) => {
  const [area, setArea] = useState<AreaState>();
  const {isCityBikesInMapEnabled, isCarSharingInMapEnabled} =
    useFeatureTogglesContext();
  const [filter, setFilter] = useState<MobilityMapFilterType>(
    initialFilter ?? {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const isFocused = useIsFocused();

  const [stations, setStations] = useState<StationFeatures>(emptyStations);

  const enableStations = isCityBikesInMapEnabled || isCarSharingInMapEnabled;

  useEffect(() => {
    if (!initialFilter) {
      // Initial filter === undefined, use user's filter from store.
      getMapFilter().then((userFilter) => {
        setFilter(userFilter.mobility ?? {});
      });
    } else {
      setFilter(initialFilter);
    }
  }, [getMapFilter, initialFilter]);

  useEffect(() => {
    if (enableStations && isFocused && area) {
      const abortCtrl = new AbortController();
      setIsLoading(true);
      const carOperators = getOperators(filter, FormFactor.Car);
      const includeCars =
        isShowAll(filter, FormFactor.Car) || carOperators.length > 0;
      const bicycleOperators = getOperators(filter, FormFactor.Bicycle);
      const includeBicycles =
        isShowAll(filter, FormFactor.Bicycle) || bicycleOperators.length > 0;
      getStations(
        {
          ...area,
          includeBicycles,
          includeCars,
          bicycleOperators,
          carOperators,
        },
        {signal: abortCtrl.signal},
      )
        .then((stations) =>
          setStations({
            bicycles: stations.bicycles
              ? toFeatureCollection(toFeaturePoints(stations.bicycles))
              : emptyCollection,
            cars: stations.cars
              ? toFeatureCollection(toFeaturePoints(stations.cars))
              : emptyCollection,
          }),
        )
        .then(() => setIsLoading(false))
        .catch(() => {}); //Most likely abort
      return () => abortCtrl.abort();
    }

    setStations(emptyStations);
  }, [area, enableStations, filter, isFocused]);

  const updateRegion = useCallback((region: MapRegion) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  }, []);

  const onFilterChange = (filter: MobilityMapFilterType) => {
    setFilter(filter);
  };
  const res = useMemo(
    () =>
      enableStations
        ? {
            stations,
            onFilterChange,
            updateRegion,
            isLoading,
          }
        : undefined,
    [enableStations, isLoading, stations, updateRegion],
  );
  return res;
};
