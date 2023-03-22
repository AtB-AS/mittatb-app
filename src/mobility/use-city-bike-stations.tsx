import React, {useEffect, useState} from 'react';
import {extend, getRadius, isStation, needsReload} from '@atb/mobility/utils';
import {
  toFeatureCollection,
  toFeaturePoint,
  toFeaturePoints,
} from '@atb/components/map/utils';
import {useIsCityBikesEnabled} from '@atb/mobility/use-city-bikes-enabled';
import {
  MapSelectionActionType,
  StationsFilter,
  StationsState,
} from '@atb/components/map/types';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  MultiPolygon,
  Polygon,
} from 'geojson';
import {StationFragment} from '@atb/api/types/generated/fragments/stations';
import {getStations} from '@atb/api/stations';
import {RegionPayload} from '@rnmapbox/maps';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {CityBikeStationSheet} from '@atb/mobility/components/CityBikeStationBottomSheet';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

const MIN_ZOOM_LEVEL = 12;
const BUFFER_DISTANCE_IN_METERS = 500;
export const useCityBikeStations: () => StationsState | undefined = () => {
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
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const [filter, setFilter] = useState<StationsFilter>();
  const [isLoading, setIsLoading] = useState(false);
  const {getMapFilter} = useUserMapFilters();
  const [loadedArea, setLoadedArea] =
    useState<Feature<Polygon | MultiPolygon>>();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const [stations, setStations] = useState<
    FeatureCollection<GeoJSON.Point, StationFragment>
  >(toFeatureCollection([]));

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.stations);
    });
  }, [isCityBikesEnabled]);

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isCityBikesEnabled) {
      if (area.zoom > MIN_ZOOM_LEVEL && filter?.showCityBikeStations) {
        if (needsReload(area.visibleBounds, loadedArea)) {
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
            .then(() => {
              setLoadedArea(
                extend(
                  toFeaturePoint(area),
                  getRadius(area.visibleBounds, BUFFER_DISTANCE_IN_METERS),
                ),
              );
            });
        }
      } else {
        setStations(toFeatureCollection([]));
        setLoadedArea(undefined);
      }
    }
    return () => abortCtrl.abort();
  }, [area, isCityBikesEnabled, filter]);

  const fetchStations = async (
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

  const onFilterChange = (filter: StationsFilter) => {
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
        fetchStations,
        isLoading,
      }
    : undefined;
};
