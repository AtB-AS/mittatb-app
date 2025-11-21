import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection} from 'geojson';

import {
  PreProcessedGeofencingZones,
  PointFeatureCollection,
} from '@atb/modules/map';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';
import {useGeofencingZonesQuery} from '@atb/modules/mobility';
import {useThemeContext} from '@atb/theme';
import {getIconZoomTransitionStyle} from '../../utils';

type GeofencingZonesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
};
export const GeofencingZones = ({
  systemId,
  vehicleTypeId,
}: GeofencingZonesProps) => {
  if (!systemId || !vehicleTypeId) {
    return <></>;
  }
  return (
    <GeofencingZonesForVehicle
      systemId={systemId}
      vehicleTypeId={vehicleTypeId}
    />
  );
};

const GeofencingZonesForVehicle = ({
  systemId,
  vehicleTypeId,
}: {
  systemId: string;
  vehicleTypeId: string;
}) => {
  const {data} = useGeofencingZonesQuery(systemId, vehicleTypeId);

  return (
    <>
      {data?.iconFeatureCollections?.map((iconFeatureCollection) => (
        <GeofencingZoneIcon
          iconFeatureCollection={iconFeatureCollection}
          key={`iconGeofencingZone_${iconFeatureCollection.renderKey}`}
        />
      ))}
      {data?.geofencingZoneFeatures?.map((geofencingZone) => (
        <GeofencingZone
          geofencingZone={geofencingZone}
          key={`geofencingZone_${geofencingZone.renderKey}`}
        />
      ))}
    </>
  );
};

const getGeofencingZoneCustomProps = ['get', 'geofencingZoneCustomProps'];

type GeofencingZoneProps = {
  geofencingZone: PreProcessedGeofencingZones;
};
const GeofencingZone = ({geofencingZone}: GeofencingZoneProps) => {
  const bgColor = [
    'get',
    'background',
    ['get', 'color', getGeofencingZoneCustomProps],
  ];
  const fillOpacity = ['get', 'fillOpacity', getGeofencingZoneCustomProps];
  const lineOpacity = ['get', 'strokeOpacity', getGeofencingZoneCustomProps];
  const lineStyle = ['get', 'lineStyle', getGeofencingZoneCustomProps];

  const lineLayerStyle = {
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
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />

      {/*
        Unfortunately since there is a bug in mapbox not supporting
        lineDasharray: ['get', 'lineDasharray'],
        a hard coded style must be used for that style prop.
      */}
      <MapboxGL.LineLayer
        id="geofencingZoneLine"
        filter={['!=', lineStyle, 'dashed']}
        style={lineLayerStyle}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
      <MapboxGL.LineLayer
        id="geofencingZoneDashedLine"
        filter={['==', lineStyle, 'dashed']}
        style={{...lineLayerStyle, lineDasharray: [2, 2]}}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
    </MapboxGL.ShapeSource>
  );
};

const reachFullScaleAtZoomLevel = 15.5;
const iconFullSize = 0.85;
const scaleTransitionZoomRange = 1.5;
const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 8;

type GeofencingZoneIconProps = {
  iconFeatureCollection: PointFeatureCollection;
};
export const GeofencingZoneIcon: React.FC<GeofencingZoneIconProps> = ({
  iconFeatureCollection,
}) => {
  const {themeName} = useThemeContext();

  const code = ['get', 'code', getGeofencingZoneCustomProps];

  // mapbox icons names are lower cased
  const lowerCaseCode = ['downcase', code];

  const iconImage = [
    'concat',
    'geofencingzone_',
    lowerCaseCode,
    '_',
    themeName,
  ];
  const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
    reachFullScaleAtZoomLevel,
    iconFullSize,
    scaleTransitionZoomRange,
    opacityTransitionExtraZoomRange,
  );

  return (
    <MapboxGL.ShapeSource
      id={`iconGeofencingZonesShapeSource_${iconFeatureCollection?.renderKey}`}
      shape={iconFeatureCollection}
    >
      <MapboxGL.SymbolLayer
        id="geofencingZoneIcon"
        style={{
          symbolZOrder: 'source',
          iconAllowOverlap: true,
          iconIgnorePlacement: true,
          iconImage: iconImage,
          iconOpacity,
          iconSize,
        }}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
    </MapboxGL.ShapeSource>
  );
};
