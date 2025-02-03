import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  StationFeatures,
  flyToLocation,
  isClusterFeature,
} from '@atb/components/map';
import {getAvailableVehicles} from '@atb/mobility/utils';
import {Camera, ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {Feature, FeatureCollection, GeoJsonProperties, Point} from 'geojson';
import React, {RefObject, useMemo} from 'react';
import {Cluster} from '../../types';
import {mapPositionToCoordinates} from '../../utils';
import {BikeStations} from './BikeStations';
import {CarStations} from './CarStations';
import {NsrProps} from '../national-stop-registry-features/NationalStopRegistryFeatures';

type Props = {
  selectedFeaturePropertyId?: NsrProps['selectedFeaturePropertyId'];
  stations: StationFeatures;
  mapCameraRef: RefObject<Camera>;
  onMapItemClick?: (e: OnPressEvent) => void;
  onClusterClick?: (feature: Feature<Point, Cluster>) => void;
};

export type StationsWithCount = FeatureCollection<
  Point,
  StationBasicFragment & {count: number}
>;

export const Stations = ({
  selectedFeaturePropertyId,
  stations,
  onMapItemClick,
  onClusterClick,
  mapCameraRef,
}: Props) => {
  const bikeStations = useFeatureCollectionWithExtraProps(
    stations.bicycles,
    (feature: Feature<Point, StationBasicFragment>) => ({
      count: getAvailableVehicles(
        feature.properties.vehicleTypesAvailable,
        FormFactor.Bicycle,
      ),
      vehicle_type_form_factor: FormFactor.Bicycle,
    }),
  );
  const carStations = useFeatureCollectionWithExtraProps(
    stations.cars,
    (feature: Feature<Point, StationBasicFragment>) => ({
      count: getAvailableVehicles(
        feature.properties.vehicleTypesAvailable,
        FormFactor.Car,
      ),
      vehicle_type_form_factor: FormFactor.Car,
    }),
  );

  const handleClusterClick = async (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => {
    const [feature, ,] = e.features;
    if (isClusterFeature(feature)) {
      const clusterExpansionZoom =
        (await clustersSource.current?.getClusterExpansionZoom(feature)) ?? 0;
      flyToLocation({
        coordinates: mapPositionToCoordinates(feature.geometry.coordinates),
        mapCameraRef,
        zoomLevel: clusterExpansionZoom,
        animationDuration: 200,
      });
      onClusterClick && onClusterClick(feature);
    }
  };

  return (
    <>
      <BikeStations
        selectedFeaturePropertyId={selectedFeaturePropertyId}
        stations={bikeStations}
        onMapItemClick={onMapItemClick}
        onClusterClick={handleClusterClick}
      />
      <CarStations
        selectedFeaturePropertyId={selectedFeaturePropertyId}
        stations={carStations}
        onMapItemClick={onMapItemClick}
        onClusterClick={handleClusterClick}
      />
    </>
  );
};

// Add extra properties to features
export function useFeatureCollectionWithExtraProps<
  P extends GeoJsonProperties,
  E extends GeoJsonProperties,
>(
  collection: FeatureCollection<Point, P>,
  getExtraProps: (feature: Feature<Point, P>) => E,
): FeatureCollection<Point, P & E> {
  return useMemo(
    () => ({
      ...collection,
      features: collection.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...getExtraProps(feature), // only change: adding these props
        },
      })),
    }),
    [collection, getExtraProps],
  );
}
