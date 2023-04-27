import React, {useEffect, useState} from 'react';
import {AreaState, isStation, updateAreaState} from '@atb/mobility/utils';
import {useIsCityBikesEnabled} from '@atb/mobility/use-city-bikes-enabled';
import {
  MapSelectionActionType,
  StationsFilterType,
  StationsState,
  toFeatureCollection,
  toFeaturePoints,
  useUserMapFilters,
} from '@atb/components/map';
import {FeatureCollection, GeoJSON} from 'geojson';
import {StationFragment} from '@atb/api/types/generated/fragments/stations';
import {getStations} from '@atb/api/stations';
import {RegionPayload} from '@rnmapbox/maps';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {CityBikeStationSheet} from '@atb/mobility/components/CityBikeStationBottomSheet';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useIsFocused} from '@react-navigation/native';

const MIN_ZOOM_LEVEL = 12;
const BUFFER_DISTANCE_IN_METERS = 500;
export const useCityBikeStations: () => StationsState | undefined = () => {
  const [area, setArea] = useState<AreaState>();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const [filter, setFilter] = useState<StationsFilterType>();
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const isFocused = useIsFocused();

  const [stations, setStations] = useState<
    FeatureCollection<GeoJSON.Point, StationFragment>
  >(toFeatureCollection([]));

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.stations);
    });
  }, [isCityBikesEnabled]);

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
          availableFormFactors: FormFactor.Bicycle,
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

  const onPress = (type: MapSelectionActionType) => {
    if (type.source !== 'map-click') return;
    const station = type.feature.properties;
    if (isStation(station)) {
      openBottomSheet(() => (
        <CityBikeStationSheet station={station} close={closeBottomSheet} />
      ));
    }
  };

  return isCityBikesEnabled
    ? {
        stations,
        onFilterChange,
        onPress,
        updateRegion,
        isLoading,
      }
    : undefined;
};
