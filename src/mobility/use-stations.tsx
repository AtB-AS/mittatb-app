import {useEffect, useState} from 'react';
import {AreaState, updateAreaState} from './utils';
import {useIsCityBikesEnabled} from './use-city-bikes-enabled';
import {
  MapRegion,
  StationsFilterType,
  StationsState,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
} from '@atb/components/map';
import {FeatureCollection, GeoJSON} from 'geojson';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useIsFocused} from '@react-navigation/native';
import {useIsCarSharingEnabled} from './use-car-sharing-enabled';
import {getStations} from '@atb/api/mobility';
import {useOperators} from '@atb/mobility/use-operators';

const MIN_ZOOM_LEVEL = 12;
const BUFFER_DISTANCE_IN_METERS = 500;
export const useStations: () => StationsState | undefined = () => {
  const [area, setArea] = useState<AreaState>();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();
  const [filter, setFilter] = useState<StationsFilterType>();
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const isFocused = useIsFocused();
  const allOperatorsOfType = useOperators();

  const [stations, setStations] = useState<
    FeatureCollection<GeoJSON.Point, StationBasicFragment>
  >(toFeatureCollection([]));

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.stations);
    });
  }, [isCityBikesEnabled, isCarSharingEnabled]);

  useEffect(() => {
    if (
      isCityBikesEnabled &&
      isFocused &&
      area &&
      (showBikes(filter) || showCars(filter))
    ) {
      const abortCtrl = new AbortController();
      setIsLoading(true);
      const formFactors = getFormFactorsFromFilter(filter);
      const operatorsFromFilter = getOperatorsFromFilter(filter);
      getStations(
        {
          ...area,
          availableFormFactors: formFactors,
          operators: operatorsFromFilter.length
            ? operatorsFromFilter
            : allOperatorsOfType(formFactors).map((o) => o.id),
        },
        {signal: abortCtrl.signal},
      )
        .then(toFeaturePoints)
        .then(toFeatureCollection)
        .then(setStations)
        .then(() => setIsLoading(false))
        .catch(() => {}); //Most likely abort
      return () => abortCtrl.abort();
    }
    setStations(toFeatureCollection([]));
  }, [area, isCityBikesEnabled, isCarSharingEnabled, filter, isFocused]);

  const updateRegion = async (region: MapRegion) => {
    setArea(updateAreaState(region, BUFFER_DISTANCE_IN_METERS, MIN_ZOOM_LEVEL));
  };

  const onFilterChange = (filter: StationsFilterType) => {
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

const showBikes = (filter: StationsFilterType | undefined) =>
  filter?.cityBikeStations?.showAll ||
  filter?.cityBikeStations?.operators.length;

const showCars = (filter: StationsFilterType | undefined) =>
  filter?.carSharingStations?.showAll ||
  filter?.carSharingStations?.operators.length;

const getFormFactorsFromFilter = (
  filter: StationsFilterType | undefined,
): FormFactor[] => {
  const formFactors = [];
  if (showBikes(filter)) formFactors.push(FormFactor.Bicycle);
  if (showCars(filter)) formFactors.push(FormFactor.Car);
  return formFactors;
};

const getOperatorsFromFilter = (filter: StationsFilterType | undefined) => {
  return [
    ...(filter?.cityBikeStations?.operators ?? []),
    ...(filter?.carSharingStations?.operators ?? []),
  ];
};
