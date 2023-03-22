import React, {useEffect, useState} from 'react';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  MultiPolygon,
  Polygon,
} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  toFeatureCollection,
  toFeaturePoint,
  toFeaturePoints,
} from '@atb/components/map/utils';
import {getVehicles} from '@atb/api/vehicles';
import {useIsVehiclesEnabled} from '@atb/mobility/use-vehicles-enabled';
import {
  MapSelectionActionType,
  VehiclesFilter,
  VehiclesState,
} from '@atb/components/map/types';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {extend, getRadius, isVehicle, needsReload} from '@atb/mobility/utils';
import {ScooterSheet} from '@atb/mobility/components/ScooterSheet';
import {RegionPayload} from '@rnmapbox/maps';
import {useUserMapFilters} from '@atb/components/map/hooks/use-map-filter';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

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

  // The area in which vehicles are already loaded
  const [loadedArea, setLoadedArea] =
    useState<Feature<Polygon | MultiPolygon>>();

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const {getMapFilter} = useUserMapFilters();

  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));

  const [filter, setFilter] = useState<VehiclesFilter>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMapFilter().then((initialFilter) => {
      setFilter(initialFilter.vehicles);
    });
  }, [isVehiclesEnabled]);

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isVehiclesEnabled) {
      if (area.zoom > MIN_ZOOM_LEVEL && filter?.showVehicles) {
        if (needsReload(area.visibleBounds, loadedArea)) {
          setIsLoading(true);
          getVehicles(area, {signal: abortCtrl.signal})
            .then(toFeaturePoints)
            .then(toFeatureCollection)
            .then(setVehicles)
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
        setVehicles(toFeatureCollection([]));
        setLoadedArea(undefined);
      }
    }
    return () => abortCtrl.abort();
  }, [area, isVehiclesEnabled, filter]);

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

  const onFilterChange = (filter: VehiclesFilter) => {
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
