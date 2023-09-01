import React from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {BikeStations} from './BikeStations';
import {getAvailableVehicles} from '@atb/mobility/utils';
import {CarStations} from './CarStations';
import {StationFeatures} from '@atb/components/map';

type Props = {
  stations: StationFeatures;
};

export type StationsWithCount = FeatureCollection<
  GeoJSON.Point,
  StationBasicFragment & {count: number}
>;

export const Stations = ({stations}: Props) => {
  const bikeStations = stationsWithCount(stations.bicycles, FormFactor.Bicycle);
  const carStations = stationsWithCount(stations.cars, FormFactor.Car);

  return (
    <>
      <BikeStations stations={bikeStations} />
      <CarStations stations={carStations} />
    </>
  );
};

/**
 * Adds a 'count' property with the number of available vehicles for each station.
 * @param stations
 * @param formFactor
 */
const stationsWithCount = (
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>,
  formFactor: FormFactor,
): StationsWithCount => {
  return {
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
  };
};
