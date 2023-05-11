import React, {useEffect, useState} from 'react';
import {AreaState, updateAreaState} from '@atb/mobility/utils';
import {useIsCityBikesEnabled} from '@atb/mobility/use-city-bikes-enabled';
import {
  StationsFilterType,
  StationsState,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
} from '@atb/components/map';
import {FeatureCollection, GeoJSON} from 'geojson';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {getStations} from '@atb/api/stations';
import {RegionPayload} from '@rnmapbox/maps';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useIsFocused} from '@react-navigation/native';

const MIN_ZOOM_LEVEL = 12;
const BUFFER_DISTANCE_IN_METERS = 500;
export const useStations: () => StationsState | undefined = () => {
  const [area, setArea] = useState<AreaState>();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const [filter, setFilter] = useState<StationsFilterType>();
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const isFocused = useIsFocused();

  const [stations, setStations] = useState<
    FeatureCollection<GeoJSON.Point, StationBasicFragment>
  >(toFeatureCollection([]));

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.stations);
    });
  }, [isCityBikesEnabled]);

  const formFactorsFromFilter = (filter: StationsFilterType) => {
    return filter.showCityBikeStations ? FormFactor.Bicycle : undefined;
  };

  useEffect(() => {
    if (
      isCityBikesEnabled &&
      isFocused &&
      area &&
      filter?.showCityBikeStations
    ) {
      const abortCtrl = new AbortController();
      setIsLoading(true);
      getStations(
        {
          ...area,
          availableFormFactors: formFactorsFromFilter(filter),
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
  }, [area, isCityBikesEnabled, filter, isFocused]);

  const updateRegion = async (
    region: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
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
