import React, {useEffect, useMemo, useState} from 'react';
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
import {useIsVehiclesEnabled} from '@atb/vehicles/use-vehicles-enabled';
import {
  MapSelectionActionType,
  VehiclesFilter,
} from '@atb/components/map/types';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {extend, getRadius, isVehicle, needsReload} from '@atb/vehicles/utils';
import {ScooterSheet} from '@atb/vehicles/components/ScooterSheet';
import {RegionPayload} from '@rnmapbox/maps';

const MIN_ZOOM_LEVEL = 13.5;
const BUFFER_DISTANCE_IN_METERS = 500;

export const useVehicles = () => {
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

  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));

  const initialFilter: VehiclesFilter = useMemo(
    () => ({
      showVehicles: isVehiclesEnabled,
    }),
    [isVehiclesEnabled],
  );

  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isVehiclesEnabled && filter.showVehicles) {
      if (area.zoom > MIN_ZOOM_LEVEL) {
        if (needsReload(area.visibleBounds, loadedArea)) {
          getVehicles(area, {signal: abortCtrl.signal})
            .then(toFeaturePoints)
            .then(toFeatureCollection)
            .then(setVehicles)
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
  }, [area, isVehiclesEnabled]);

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

  return {vehicles, initialFilter, onFilterChange, onPress, fetchVehicles};
};
