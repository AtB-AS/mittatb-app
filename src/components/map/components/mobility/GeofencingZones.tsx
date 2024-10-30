import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection} from 'geojson';

import {
  PreProcessedGeofencingZones,
  usePreProcessedGeofencingZones,
} from '@atb/components/map';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query';

import {hitboxCoveringIconOnly} from '@atb/components/map';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';

type GeofencingZonesProps = {
  selectedVehicleId: string;
};
export const GeofencingZones = ({selectedVehicleId}: GeofencingZonesProps) => {
  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(selectedVehicleId);

  if (!vehicle || !selectedVehicleId || isLoading || isError) {
    return <></>;
  }
  return <GeofencingZonesForVehicle vehicle={vehicle} />;
};

type GeofencingZonesForVehicleProps = {
  vehicle: VehicleExtendedFragment;
};
const GeofencingZonesForVehicle = ({
  vehicle,
}: GeofencingZonesForVehicleProps) => {
  const preProcessedGeofencingZones = usePreProcessedGeofencingZones(vehicle);

  return (
    <>
      {preProcessedGeofencingZones.map((geofencingZone) => (
        <GeofencingZone
          geofencingZone={geofencingZone}
          key={geofencingZone?.renderKey}
        />
      ))}
    </>
  );
};

type GeofencingZoneProps = {
  geofencingZone: PreProcessedGeofencingZones;
};
const GeofencingZone = ({geofencingZone}: GeofencingZoneProps) => {
  const getGeofencingZoneCustomProps = ['get', 'geofencingZoneCustomProps'];

  const bgColor = [
    'get',
    'background',
    ['get', 'color', getGeofencingZoneCustomProps],
  ];
  const fillOpacity = ['get', 'fillOpacity', getGeofencingZoneCustomProps];
  const lineOpacity = ['get', 'strokeOpacity', getGeofencingZoneCustomProps];
  const lineIsDashed = ['get', 'lineIsDashed', getGeofencingZoneCustomProps];

  const lineStyle = {
    lineWidth: ['interpolate', ['exponential', 1.5], ['zoom'], 12, 2, 18, 4],
    lineColor: bgColor,
    lineOpacity,
    lineCap: 'round',
    lineJoin: 'round',
  };

  return (
    <MapboxGL.ShapeSource
      id={'geofencingZonesShapeSource_' + geofencingZone?.renderKey}
      shape={geofencingZone.geojson as FeatureCollection} // FeatureCollection from mobility-types_v2 and FeatureCollection from geojson used by MapboxGL don't match perfectly
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
    >
      <MapboxGL.FillLayer
        id="geofencingZoneFill"
        style={{
          fillAntialias: true,
          fillColor: bgColor,
          fillOpacity,
        }}
        aboveLayerID="water-point-label"
      />

      {/*
        Unfortunately since there is a bug in mapbox not supporting
        lineDasharray: ['get', 'lineDasharray'],
        a hard coded style must be used for that style prop.
      */}
      <MapboxGL.LineLayer
        id="geofencingZoneLine"
        filter={['!', lineIsDashed]}
        style={lineStyle}
        aboveLayerID="water-point-label"
      />
      <MapboxGL.LineLayer
        id="geofencingZoneDashedLine"
        filter={lineIsDashed}
        style={{...lineStyle, lineDasharray: [2, 2]}}
        aboveLayerID="water-point-label"
      />
    </MapboxGL.ShapeSource>
  );
};
