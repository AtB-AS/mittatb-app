import MapboxGL from '@rnmapbox/maps';
import {useMemo} from 'react';

import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useThemeContext} from '@atb/theme';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {geofencingZoneCodes} from '../../utils';
import {getIconZoomTransitionStyle} from '@atb-as/mapbox-shared';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';

import {
  AllLayerStyleProps,
  Expression,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';

const geofencingZonesVectorSourceId = 'geofencing-zones-source';
const geofencingZonesFeaturesLayerId = 'geofencing_zones_features';
const geofencingZonesIconSourceLayerId = 'geofencing_zones_icons';
const virtualStationsSourceLayerId = 'virtual_stations';

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
};

export const GeofencingZonesAsTiles = ({
  systemId,
  vehicleTypeId,
}: GeofencingZonesAsTilesProps) => {
  const {
    isGeofencingZonesEnabled,
    isGeofencingZonesAsTilesEnabled,
    isVirtualStationsEnabled,
  } = useFeatureTogglesContext();
  const {theme, themeName} = useThemeContext();
  const virtualStationsTileLayerName: TileLayerName = 'virtual_stations';
  const tileLayerNames: TileLayerName[] = [
    'geofencing_zones_features',
    'geofencing_zones_icons',
    ...(isVirtualStationsEnabled ? [virtualStationsTileLayerName] : []),
  ];

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
  const parkingStyle = theme.color.geofencingZone.parking;

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

  const lineBaseStyle: AllLayerStyleProps = {
    lineEmissiveStrength: 1,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: lineWidth,
  };

  const fillBaseStyle: AllLayerStyleProps = {
    fillAntialias: true,
    fillEmissiveStrength: 1,
  };

  const symbolBaseStyle: AllLayerStyleProps = {
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconEmissiveStrength: 1,
  };

  const dashedArray: [number, number] = [2, 2];
  const lineLayerConfigs = [
    {
      id: 'GeofencingZones_Line_Solid',
      filter: solidFilter,
      dashArray: undefined,
    },
    {
      id: 'GeofencingZones_Line_Dashed',
      filter: dashedFilter,
      dashArray: dashedArray,
    },
  ];

  const enabled = isGeofencingZonesEnabled && isGeofencingZonesAsTilesEnabled;
  if (!enabled || !systemId || !vehicleTypeId) {
    return null;
  }

  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      key={tileUrlTemplate}
      tileUrlTemplates={tileUrlTemplates}
      minZoomLevel={minZoomLevel}
      maxZoomLevel={maxZoomLevel}
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
            ...fillBaseStyle,
            fillSortKey: sortKey,
            fillColor,
            fillOpacity,
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
              ...lineBaseStyle,
              lineSortKey: sortKey,
              lineColor: fillColor,
              lineOpacity: lineOpacity,
              lineDasharray: dashArray,
            }}
          />
        ))}

        <MapboxGL.SymbolLayer
          id="geofencing-zone-icon-layer"
          slot="top"
          sourceID={geofencingZonesVectorSourceId}
          sourceLayerID={geofencingZonesIconSourceLayerId}
          minZoomLevel={minZoomLevel}
          style={{
            ...symbolBaseStyle,
            symbolSortKey: sortKey,
            iconOpacity,
            iconSize,
            iconImage,
          }}
          filter={iconFilter}
          aboveLayerID={MapSlotLayerId.GeofencingZonesIcons}
        />

        {!!isVirtualStationsEnabled && (
          <>
            <MapboxGL.FillLayer
              id="virtual-station-area-fill"
              sourceID={geofencingZonesVectorSourceId}
              sourceLayerID={virtualStationsSourceLayerId}
              aboveLayerID={MapSlotLayerId.VirtualStationAreas}
              minZoomLevel={minZoomLevel}
              slot="middle"
              style={{
                ...fillBaseStyle,
                fillColor: parkingStyle.color.background,
                fillOpacity: parkingStyle.fillOpacity,
              }}
            />
            <MapboxGL.LineLayer
              id="virtual-station-area-line"
              sourceID={geofencingZonesVectorSourceId}
              sourceLayerID={virtualStationsSourceLayerId}
              aboveLayerID={MapSlotLayerId.VirtualStationAreas}
              minZoomLevel={minZoomLevel}
              slot="middle"
              style={{
                ...lineBaseStyle,
                lineColor: parkingStyle.color.background,
                lineOpacity: parkingStyle.strokeOpacity,
                lineDasharray:
                  parkingStyle.lineStyle === 'solid' ? undefined : dashedArray,
              }}
            />
            <MapboxGL.SymbolLayer
              id="virtual-stations-layer"
              slot="top"
              sourceID={geofencingZonesVectorSourceId}
              sourceLayerID={virtualStationsSourceLayerId}
              minZoomLevel={minZoomLevel}
              style={{
                ...symbolBaseStyle,
                iconOpacity,
                iconSize,
                iconImage: 'geofencingzone_parking_' + themeName,
              }}
              filter={['==', ['geometry-type'], 'Point']}
              aboveLayerID={MapSlotLayerId.VirtualStationIcons}
            />
          </>
        )}
      </>
    </MapboxGL.VectorSource>
  );
};
