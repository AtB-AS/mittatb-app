import {useEffect, useState} from 'react';
import {AreaState, getOperators, isShowAll, updateAreaState} from './utils';
import {useIsCityBikesEnabled} from './use-city-bikes-enabled';
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
import {useIsCarSharingEnabled} from './use-car-sharing-enabled';
import {getStations} from '@atb/api/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

const MIN_ZOOM_LEVEL = 12;
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
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();
  const [filter, setFilter] = useState<MobilityMapFilterType>(
    initialFilter ?? {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const isFocused = useIsFocused();

  const [stations, setStations] = useState<StationFeatures>(emptyStations);

  useEffect(() => {
    if (!initialFilter) {
      // Initial filter === undefined, use user's filter from store.
      getMapFilter().then((userFilter) => {
        setFilter(userFilter.mobility ?? {});
      });
    }
  }, [initialFilter, isCityBikesEnabled, isCarSharingEnabled]);

  useEffect(() => {
    if (isCityBikesEnabled && isFocused && area) {
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
  }, [area, isCityBikesEnabled, isCarSharingEnabled, filter, isFocused]);

  const updateRegion = async (region: MapRegion) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  };

  const onFilterChange = (filter: MobilityMapFilterType) => {
    setFilter(filter);
  };

  return isCityBikesEnabled
    ? {
        stations,
        onFilterChange,
        updateRegion,
        isLoading,
      }
    : undefined;
};
