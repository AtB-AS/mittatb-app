import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection, GeoJsonProperties, Point, Feature} from 'geojson';

import {usePreProcessedGeofencingZones} from '@atb/components/map';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query';
import {isBicycle, isScooter} from '@atb/mobility';
import {hitboxCoveringIconOnly} from '@atb/components/map';

type GeofencingZonesProps = {
  selectedFeature: Feature<Point, GeoJsonProperties>;
};

export const GeofencingZones = ({selectedFeature}: GeofencingZonesProps) => {
  const selectedVehicleId =
    isScooter(selectedFeature) || isBicycle(selectedFeature)
      ? selectedFeature.properties.id
      : undefined;

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(selectedVehicleId);

  const preProcessedGeofencingZones = usePreProcessedGeofencingZones(vehicle);

  if (
    !selectedVehicleId ||
    isLoading ||
    isError ||
    preProcessedGeofencingZones.length === 0
  ) {
    return <></>;
  }

  const mappedGeofencingZones = preProcessedGeofencingZones.map(
    (geofencingZone) => {
      const getGeofencingZoneCustomProps = ['get', 'geofencingZoneCustomProps'];
      const bgColor = [
        'get',
        'background',
        ['get', 'color', getGeofencingZoneCustomProps],
      ];
      const fillOpacity = ['get', 'fillOpacity', getGeofencingZoneCustomProps];
      const lineOpacity = [
        'get',
        'background',
        ['get', 'strokeOpacity', getGeofencingZoneCustomProps],
      ];

      return (
        <MapboxGL.ShapeSource
          key={geofencingZone?.renderKey}
          id={'geofencingZonesShapeSource_' + geofencingZone?.renderKey}
          shape={geofencingZone.geojson as FeatureCollection} // todo: fix GeofencingZonesType in mobility-types_v2
          hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
        >
          <MapboxGL.FillLayer
            id="parkingFill"
            style={{
              fillAntialias: true,
              fillColor: bgColor,
              fillOpacity,
            }}
            aboveLayerID="water-point-label"
          />
          <MapboxGL.LineLayer
            id="tariffZonesLine"
            style={{
              lineWidth: 3,
              lineColor: bgColor,
              lineOpacity,
            }}
            aboveLayerID="water-point-label"
          />
        </MapboxGL.ShapeSource>
      );
    },
  );

  return <>{mappedGeofencingZones}</>;
};
