import MapboxGL from '@rnmapbox/maps';
import {useMemo} from 'react';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useThemeContext} from '@atb/theme';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {geofencingZoneCodes, getIconZoomTransitionStyle} from '../../utils';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';

import {Expression} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';

const geofencingZonesVectorSourceId = 'geofencing-zones-source';
const geofencingZonesFeaturesLayerId = 'geofencing_zones_features';
const geofencingZonesIconSourceLayerId = 'geofencing_zones_icons';

const minZoomLevel = 9;
const maxZoomLevel = 12;

const code: Expression = ['coalesce', ['get', 'code'], 'allowed'];
const lowerCaseCode: Expression = ['downcase', code];
const iconFilter: Expression = ['!=', lowerCaseCode, 'allowed'];

const sortKey: Expression = [
  'match',
  code,
  ...geofencingZoneCodes.flatMap((val, index) => [val, index]),
  geofencingZoneCodes.length,
];

const tileLayerNames: TileLayerName[] = [
  'geofencing_zones_features',
  'geofencing_zones_icons',
];

const iconReachFullScaleAtZoomLevel = 15.5;
const iconFullSize = 0.85;
const iconScaleTransitionZoomRange = 1.5;
const iconOpacityTransitionExtraZoomRange = iconScaleTransitionZoomRange / 8;

const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
  iconReachFullScaleAtZoomLevel,
  iconFullSize,
  iconScaleTransitionZoomRange,
  iconOpacityTransitionExtraZoomRange,
);

type GeofencingZonesAsTilesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
  geofencingZoneOnPress: (e: OnPressEvent) => void;
};

export const GeofencingZonesAsTiles = ({
  systemId,
  vehicleTypeId,
  geofencingZoneOnPress,
}: GeofencingZonesAsTilesProps) => {
  const {isGeofencingZonesEnabled, isGeofencingZonesAsTilesEnabled} =
    useFeatureTogglesContext();
  const {theme, themeName} = useThemeContext();

  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {
    systemId: systemId ?? '',
    vehicleTypeId: vehicleTypeId ?? '',
  });

  const tileUrlTemplates = useMemo(
    () => [tileUrlTemplate || ''],
    [tileUrlTemplate],
  );

  const dashedCodes = useMemo(
    () =>
      geofencingZoneCodes.filter(
        (zoneCode) =>
          theme.color.geofencingZone[zoneCode].lineStyle === 'dashed',
      ),
    [theme],
  );

  // Filters using the "logic flip" for mutual exclusivity between solid/dashed
  const dashedFilter: Expression = ['match', code, ...dashedCodes, true, false];
  const solidFilter: Expression = ['match', code, ...dashedCodes, false, true];

  const backgroundMap = geofencingZoneCodes.flatMap((zoneCode) => [
    zoneCode,
    theme.color.geofencingZone[zoneCode].color.background,
  ]);

  const fillOpacityMap = geofencingZoneCodes.flatMap((zoneCode) => [
    zoneCode,
    theme.color.geofencingZone[zoneCode].fillOpacity,
  ]);

  const strokeOpacityMap = geofencingZoneCodes.flatMap((zoneCode) => [
    zoneCode,
    theme.color.geofencingZone[zoneCode].strokeOpacity,
  ]);

  const fillColor: Expression = [
    'match',
    code,
    ...backgroundMap,
    'rgba(0,0,0,0)',
  ];
  const fillOpacity: Expression = ['match', code, ...fillOpacityMap, 0];
  const lineOpacity: Expression = ['match', code, ...strokeOpacityMap, 0];
  const lineWidth: Expression = [
    'interpolate',
    ['exponential', 1.5],
    ['zoom'],
    12,
    2,
    18,
    4,
  ];

  const iconImage: Expression = [
    'concat',
    'geofencingzone_',
    lowerCaseCode,
    '_',
    themeName,
  ];

  const lineLayerConfigs = [
    {
      id: 'GeofencingZones_Line_Solid',
      filter: solidFilter,
      dashArray: undefined,
    },
    {
      id: 'GeofencingZones_Line_Dashed',
      filter: dashedFilter,
      dashArray: [2, 2] as [number, number],
    },
  ];

  const enabled = isGeofencingZonesEnabled && isGeofencingZonesAsTilesEnabled;
  if (!enabled || !systemId || !vehicleTypeId) {
    return null;
  }

  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      tileUrlTemplates={tileUrlTemplates}
      minZoomLevel={minZoomLevel}
      maxZoomLevel={maxZoomLevel}
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
      onPress={geofencingZoneOnPress}
    >
      <>
        <MapboxGL.FillLayer
          id="GeofencingZones_Fill_Consolidated"
          sourceID={geofencingZonesVectorSourceId}
          sourceLayerID={geofencingZonesFeaturesLayerId}
          aboveLayerID={MapSlotLayerId.GeofencingZones}
          minZoomLevel={minZoomLevel}
          slot="middle"
          style={{
            fillSortKey: sortKey,
            fillColor,
            fillOpacity,
            fillAntialias: true,
            fillEmissiveStrength: 1,
          }}
        />

        {lineLayerConfigs.map(({id, filter, dashArray}) => (
          <MapboxGL.LineLayer
            key={id}
            id={id}
            aboveLayerID={MapSlotLayerId.GeofencingZones}
            sourceID={geofencingZonesVectorSourceId}
            sourceLayerID={geofencingZonesFeaturesLayerId}
            minZoomLevel={minZoomLevel}
            slot="middle"
            filter={filter}
            style={{
              lineSortKey: sortKey,
              lineColor: fillColor,
              lineOpacity: lineOpacity,
              lineEmissiveStrength: 1,
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: lineWidth,
              lineDasharray: dashArray,
            }}
          />
        ))}

        <MapboxGL.SymbolLayer
          id="geofencing-zone-icon-layer"
          sourceID={geofencingZonesVectorSourceId}
          sourceLayerID={geofencingZonesIconSourceLayerId}
          minZoomLevel={minZoomLevel}
          style={{
            symbolSortKey: sortKey,
            iconOpacity,
            iconSize,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            iconEmissiveStrength: 1,
            iconImage,
          }}
          filter={iconFilter}
          aboveLayerID={MapSlotLayerId.GeofencingZonesIcons}
        />
      </>
    </MapboxGL.VectorSource>
  );
};
