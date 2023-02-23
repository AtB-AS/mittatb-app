import React, {useEffect, useState} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {toFeatureCollection, toGeoJSONFeature} from '@atb/components/map/utils';
import {getVehicles} from '@atb/api/vehicles';
import {useIsVehiclesEnabled} from '@atb/vehicles/use-vehicles-enabled';
import {MapSelectionActionType} from '@atb/components/map/types';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {isVehicle} from '@atb/vehicles/utils';
import {ScooterSheet} from '@atb/vehicles/components/ScooterSheet';
import {FetchVehicleOpts} from '@atb/components/map/types';

const MIN_ZOOM_LEVEL = 13.5;

export const useVehicles = () => {
  const [area, setArea] = useState({
    lat: 0,
    lon: 0,
    zoom: 15,
    range: 0,
  });

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));
  const isVehiclesEnabled = useIsVehiclesEnabled();

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isVehiclesEnabled) {
      if (area.zoom > MIN_ZOOM_LEVEL) {
        getVehicles(area, {signal: abortCtrl.signal})
          .then(toGeoJSONFeature)
          .then(toFeatureCollection)
          .then(setVehicles);
      } else {
        setVehicles(toFeatureCollection([]));
      }
    }
    return () => abortCtrl.abort();
  }, [area, isVehiclesEnabled]);

  const fetchVehicles = async ({
    coordinates: {latitude, longitude},
    zoom,
    radius,
  }: FetchVehicleOpts) => {
    setArea({
      lat: latitude,
      lon: longitude,
      zoom,
      range: radius ?? 500,
    });
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

  return {vehicles, onPress, fetchVehicles};
};
