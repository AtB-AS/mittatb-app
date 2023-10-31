import React, {RefObject} from 'react';
import {Feature, Point} from 'geojson';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {Cluster, VehicleFeatures} from '../../types';
import {Scooters} from './Scooters';
import {Bicycles} from './Bicycles';
import {flyToLocation, isClusterFeature} from '@atb/components/map';
import {mapPositionToCoordinates} from '../../utils';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/types/OnPressEvent';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  mapViewRef: RefObject<MapboxGL.MapView>;
  vehicles: VehicleFeatures;
  onClusterClick: (feature: Feature<Point, Cluster>) => void;
};

export const Vehicles = ({
  mapCameraRef,
  mapViewRef,
  vehicles,
  onClusterClick,
}: Props) => {
  const handleClusterClick = async (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => {
    const [feature, ,] = e.features;
    if (isClusterFeature(feature)) {
      const clusterExpansionZoom =
        (await clustersSource.current?.getClusterExpansionZoom(feature)) ?? 0;

      const fromZoomLevel = (await mapViewRef.current?.getZoom()) ?? 0;
      // Zoom "2 levels" or to the point where the cluster expands, whichever
      // is greater.
      const toZoomLevel = Math.max(fromZoomLevel + 2, clusterExpansionZoom);

      flyToLocation({
        coordinates: mapPositionToCoordinates(feature.geometry.coordinates),
        mapCameraRef,
        zoomLevel: toZoomLevel,
        animationDuration: Math.abs(fromZoomLevel - toZoomLevel) * 100,
      });
      onClusterClick(feature);
    }
  };

  return (
    <>
      <Scooters
        scooters={vehicles.scooters}
        onClusterClick={handleClusterClick}
      />
      <Bicycles
        bicycles={vehicles.bicycles}
        onClusterClick={handleClusterClick}
      />
    </>
  );
};
