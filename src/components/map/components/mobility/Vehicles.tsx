import React, {RefObject} from 'react';
import {Feature, FeatureCollection, GeoJSON, Point} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {Cluster} from '../../types';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Scooters} from './Scooters';
import {Bicycles} from './Bicycles';
import {flyToLocation, isClusterFeature} from '@atb/components/map';
import {mapPositionToCoordinates} from '../../utils';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/types/OnPressEvent';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  vehicles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  onClusterClick: (feature: Feature<Point, Cluster>) => void;
};

export const Vehicles = ({mapCameraRef, vehicles, onClusterClick}: Props) => {
  const scooters: FeatureCollection<GeoJSON.Point, VehicleBasicFragment> =
    getFeaturesOfType(vehicles, FormFactor.Scooter);
  const bicycles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment> =
    getFeaturesOfType(vehicles, FormFactor.Bicycle);

  const handleClusterClick = async (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => {
    const [feature, ,] = e.features;
    if (isClusterFeature(feature)) {
      const clusterExpansionZoom =
        (await clustersSource.current?.getClusterExpansionZoom(feature)) ?? 0;
      const zoomLevel = Math.max(clusterExpansionZoom, 17.5);
      flyToLocation({
        coordinates: mapPositionToCoordinates(feature.geometry.coordinates),
        mapCameraRef,
        zoomLevel,
        animationDuration: 400,
      });
      onClusterClick(feature);
    }
  };

  return (
    <>
      <Scooters scooters={scooters} onClusterClick={handleClusterClick} />
      <Bicycles bicycles={bicycles} onClusterClick={handleClusterClick} />
    </>
  );
};

function getFeaturesOfType(
  vehicles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>,
  formFactor: FormFactor,
) {
  return {
    ...vehicles,
    features: vehicles.features.filter(
      (f) => f.properties.vehicleType.formFactor === formFactor,
    ),
  };
}
