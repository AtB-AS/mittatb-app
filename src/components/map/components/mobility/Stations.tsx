import React from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import MapboxGL from '@rnmapbox/maps';
import MapboxGL, {OnPressEvent} from '@rnmapbox/maps';
import {MapSelectionActionType} from '../../types';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {BikeStations} from './BikeStations';
import {getAvailableVehicles} from '@atb/mobility/utils';
import {CarStations} from './CarStations';
import {flyToLocation, isFeaturePoint} from '@atb/components/map';
import {toCoordinates} from '../../utils';

type Props = {
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>;
};

export type StationsWithCount = FeatureCollection<
  GeoJSON.Point,
  StationBasicFragment & {count: number}
>;

export const Stations = ({stations}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_bike');

const getFeaturesOfType = (
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>,
  formFactor: FormFactor,
) => ({
  stations: {
    ...stations,
    features: stations.features.filter((station) =>
      station.properties.vehicleTypesAvailable?.some(
        (type) => type.vehicleType.formFactor === formFactor,
      ),
    ),
  },
  formFactor,
});

const stationsWithCount = ({
  stations,
  formFactor,
}: {
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>;
  formFactor: FormFactor;
}): StationsWithCount => ({
  ...stations,
  features: stations.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      count: getAvailableVehicles(
        feature.properties.vehicleTypesAvailable,
        formFactor,
      ),
    },
  })),
});

export const Stations = ({mapCameraRef, stations, onPress}: Props) => {
  const bikeStations = stationsWithCount(
    getFeaturesOfType(stations, FormFactor.Bicycle),
  );
  const carStations = stationsWithCount(
    getFeaturesOfType(stations, FormFactor.Car),
  );

  const onStationPress = (e: OnPressEvent) => {
    const [feature, ..._] = e.features;
    if (isFeaturePoint(feature)) {
      flyToLocation({
        coordinates: toCoordinates(feature.geometry.coordinates),
        mapCameraRef,
      });
      onPress({
        source: 'map-click',
        feature,
      });
    }
  };

  return (
    <>
      <BikeStations
        mapCameraRef={mapCameraRef}
        stations={bikeStations}
        onPress={onStationPress}
      />
      <CarStations
        mapCameraRef={mapCameraRef}
        stations={carStations}
        onPress={onStationPress}
      />
    </>
  );
};
