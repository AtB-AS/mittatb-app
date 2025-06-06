import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  StationFeatures,
  flyToLocation,
  isClusterFeature,
} from '@atb/modules/map';
import {getAvailableVehicles} from '@atb/modules/mobility';
import MapboxGL from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {Feature, FeatureCollection, GeoJSON, Point} from 'geojson';
import React, {RefObject} from 'react';
import {Cluster} from '../../types';
import {mapPositionToCoordinates} from '../../utils';
import {BikeStations} from './BikeStations';
import {CarStations} from './CarStations';

type Props = {
  stations: StationFeatures;
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  onClusterClick?: (feature: Feature<Point, Cluster>) => void;
};

export type StationsWithCount = FeatureCollection<
  GeoJSON.Point,
  StationBasicFragment & {count: number}
>;

export const Stations = ({
  stations,
  onClusterClick,
  mapCameraRef,
  mapViewRef,
}: Props) => {
  const bikeStations = stationsWithCount(stations.bicycles, FormFactor.Bicycle);
  const carStations = stationsWithCount(stations.cars, FormFactor.Car);

  const handleClusterClick = async (
    e: OnPressEvent,
    clustersSource: RefObject<MapboxGL.ShapeSource | null>,
  ) => {
    const [feature] = e.features;
    if (isClusterFeature(feature)) {
      const clusterExpansionZoom =
        (await clustersSource.current?.getClusterExpansionZoom(feature)) ?? 0;
      flyToLocation({
        coordinates: mapPositionToCoordinates(feature.geometry.coordinates),
        mapCameraRef,
        mapViewRef,
        zoomLevel: clusterExpansionZoom,
      });
      onClusterClick && onClusterClick(feature);
    }
  };

  return (
    <>
      <BikeStations
        stations={bikeStations}
        onClusterClick={handleClusterClick}
      />
      <CarStations stations={carStations} onClusterClick={handleClusterClick} />
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
