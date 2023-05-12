import React from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {BikeStations} from './BikeStations';
import {getAvailableVehicles} from '@atb/mobility/utils';
import {CarStations} from './CarStations';

type Props = {
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>;
};

export type StationsWithCount = FeatureCollection<
  GeoJSON.Point,
  StationBasicFragment & {count: number}
>;

export const Stations = ({stations}: Props) => {
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

  const bikeStations = stationsWithCount(
    getFeaturesOfType(stations, FormFactor.Bicycle),
  );
  const carStations = stationsWithCount(
    getFeaturesOfType(stations, FormFactor.Car),
  );

  return (
    <>
      <BikeStations stations={bikeStations} />
      <CarStations stations={carStations} />
    </>
  );
};
