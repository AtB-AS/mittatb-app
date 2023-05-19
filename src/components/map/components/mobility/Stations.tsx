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
  const bikeStations = stationsWithCount(stations, FormFactor.Bicycle);
  const carStations = stationsWithCount(stations, FormFactor.Car);

  return (
    <>
      <BikeStations stations={bikeStations} />
      <CarStations stations={carStations} />
    </>
  );
};

/**
 * Filters the collection of stations to return only those with the given form factor
 * @param stations
 * @param formFactor
 */
const getFeaturesOfType = (
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>,
  formFactor: FormFactor,
): FeatureCollection<GeoJSON.Point, StationBasicFragment> => ({
  ...stations,
  features: stations.features.filter((station) =>
    station.properties.vehicleTypesAvailable?.some(
      (type) => type.vehicleType.formFactor === formFactor,
    ),
  ),
});

/**
 * Adds a 'count' property with the number of available vehicles for each station.
 * @param allStations
 * @param formFactor
 */
const stationsWithCount = (
  allStations: FeatureCollection<GeoJSON.Point, StationBasicFragment>,
  formFactor: FormFactor,
): StationsWithCount => {
  const stationWithFormFactor = getFeaturesOfType(allStations, formFactor);
  return {
    ...stationWithFormFactor,
    features: stationWithFormFactor.features.map((feature) => ({
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
