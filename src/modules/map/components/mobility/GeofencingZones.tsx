import MapboxGL from '@rnmapbox/maps';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {
  MapSlotLayerId,
  StyleJsonVectorSource,
} from '../../hooks/use-mapbox-json-style';
import {useMemo} from 'react';
import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {useThemeContext} from '@atb/theme';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {GeofencingZoneCode} from '@atb-as/theme';
import {Expression} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {geofencingZoneCodes} from '../../utils';

const geofencingZonesVectorSourceId = 'geofencing-zones-source';
const sourceLayerId = 'geofencing_zones_features';
const minZoomLevel = 9;
const maxZoomLevel = 12;

type GeofencingZonesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
  geofencingZoneOnPress: (e: OnPressEvent) => void;
};
export const GeofencingZones = ({
  systemId,
  vehicleTypeId,
  geofencingZoneOnPress,
}: GeofencingZonesProps) => {
  if (!systemId || !vehicleTypeId) {
    return <></>;
  }
  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      existing={true}
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
      onPress={geofencingZoneOnPress}
    >
      {geofencingZoneCodes.map((geofencingZoneCode) => (
        <GeofencingZonesForVehicle
          key={geofencingZoneCode}
          geofencingZoneCode={geofencingZoneCode}
        />
      ))}
    </MapboxGL.VectorSource>
  );
};

const GeofencingZonesForVehicle = ({
  geofencingZoneCode,
}: {
  geofencingZoneCode: GeofencingZoneCode;
}) => {
  const {geofencingZoneStyle, code} = useGeofencingZoneProps();

  const bgColor: Expression = [
    'get',
    'background',
    ['get', 'color', geofencingZoneStyle],
  ];
  const fillOpacity: Expression = ['get', 'fillOpacity', geofencingZoneStyle];

  return (
    <>
      <MapboxGL.FillLayer
        id={'geofencingZoneFill_' + geofencingZoneCode}
        sourceID={geofencingZonesVectorSourceId}
        sourceLayerID={sourceLayerId}
        minZoomLevel={minZoomLevel}
        style={{
          fillAntialias: true,
          fillColor: bgColor,
          fillOpacity,
        }}
        aboveLayerID={MapSlotLayerId[`GeofencingZones_${geofencingZoneCode}`]}
        filter={['==', code, geofencingZoneCode]}
      />

      {/*
        Unfortunately since there is a bug in mapbox not supporting
        lineDasharray: ['get', 'lineDasharray'],
        a hard coded style must be used for that style prop.
      */}
      <GfzLineLayer geofencingZoneCode={geofencingZoneCode} isDashed={true} />
      <GfzLineLayer geofencingZoneCode={geofencingZoneCode} isDashed={false} />
    </>
  );
};

const GfzLineLayer = ({
  isDashed,
  geofencingZoneCode,
}: {
  isDashed: boolean;
  geofencingZoneCode: GeofencingZoneCode;
}) => {
  const {geofencingZoneStyle, code} = useGeofencingZoneProps();
  const lineOpacity: Expression = ['get', 'strokeOpacity', geofencingZoneStyle];
  const lineStyle: Expression = ['get', 'lineStyle', geofencingZoneStyle];
  const lineColor: Expression = [
    'get',
    'background',
    ['get', 'color', geofencingZoneStyle],
  ]; // same as bg

  const lineLayerStyle = {
    lineWidth: ['interpolate', ['exponential', 1.5], ['zoom'], 12, 2, 18, 4],
    lineColor,
    lineOpacity,
    lineCap: 'round',
    lineJoin: 'round',
  };

  return (
    <MapboxGL.LineLayer
      id={`geofencingZone${isDashed ? 'Dashed' : ''}Line_${geofencingZoneCode}`}
      sourceID={geofencingZonesVectorSourceId}
      sourceLayerID={sourceLayerId}
      minZoomLevel={minZoomLevel}
      filter={[
        'all',
        [isDashed ? '==' : '!=', lineStyle, 'dashed'],
        ['==', code, geofencingZoneCode],
      ]}
      style={{
        ...lineLayerStyle,
        lineDasharray: isDashed ? [2, 2] : undefined,
      }}
      aboveLayerID={MapSlotLayerId[`GeofencingZones_${geofencingZoneCode}`]}
    />
  );
};

const useGeofencingZoneProps = () => {
  const {theme} = useThemeContext();
  const code = ['coalesce', ['get', 'code'], 'allowed'];
  const geofencingZoneStyles = ['literal', theme.color.geofencingZone];
  const geofencingZoneStyle = ['get', code, geofencingZoneStyles];
  return {
    geofencingZoneStyle,
    code,
  };
};

/**
 * In order to only store live data in memory, not in the locally stored cache,
 * volatile should be set to true. However, since rnmapbox doesn't yet support
 * this prop on MapboxGL.VectorSource (see https://github.com/rnmapbox/maps/discussions/3351),
 * the source must instead be sent directly as styleJson. MapboxGL.VectorSource can
 * then access this source with existing=true and the same source id.
 * @returns {id: string, source: StyleJsonVectorSource}
 */
export const useGeofencingZonesVectorSource: (
  systemId: string,
  vehicleTypeId: string,
) => {
  id: string;
  source: StyleJsonVectorSource;
} = (systemId, vehicleTypeId) => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = ['geofencing_zones_features'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {
    systemId,
    vehicleTypeId,
  });

  return useMemo(
    () => ({
      id: geofencingZonesVectorSourceId,
      source: {
        type: 'vector',
        tiles: [tileUrlTemplate || ''],
        minzoom: minZoomLevel,
        maxzoom: maxZoomLevel,
        volatile: false, // hmmmm true?
      },
    }),
    [tileUrlTemplate],
  );
};

// const reachFullScaleAtZoomLevel = 15.5;
// const iconFullSize = 0.85;
// const scaleTransitionZoomRange = 1.5;
// const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 8;

// type GeofencingZoneIconProps = {
//   iconFeatureCollection: PointFeatureCollection;
// };
// export const GeofencingZoneIcon: React.FC<GeofencingZoneIconProps> = ({
//   iconFeatureCollection,
// }) => {
//   const {themeName} = useThemeContext();

//   const code = ['get', 'code', getGeofencingZoneCustomProps];

//   // mapbox icons names are lower cased
//   const lowerCaseCode = ['downcase', code];

//   const iconImage = [
//     'concat',
//     'geofencingzone_',
//     lowerCaseCode,
//     '_',
//     themeName,
//   ];
//   const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
//     reachFullScaleAtZoomLevel,
//     iconFullSize,
//     scaleTransitionZoomRange,
//     opacityTransitionExtraZoomRange,
//   );

//   return (
//     <MapboxGL.ShapeSource
//       id={`iconGeofencingZonesShapeSource_${iconFeatureCollection?.renderKey}`}
//       shape={iconFeatureCollection}
//     >
//       <MapboxGL.SymbolLayer
//         id="geofencingZoneIcon"
//         style={{
//           symbolZOrder: 'source',
//           iconAllowOverlap: true,
//           iconIgnorePlacement: true,
//           iconImage: iconImage,
//           iconOpacity,
//           iconSize,
//         }}
//         aboveLayerID={MapSlotLayerId.GeofencingZones}
//       />
//     </MapboxGL.ShapeSource>
//   );
// };
