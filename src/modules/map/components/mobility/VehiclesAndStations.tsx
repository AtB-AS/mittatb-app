import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {
  hitboxCoveringIconOnly,
  useMapContext,
  useMapSymbolStyles,
} from '@atb/modules/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {
  MapSlotLayerId,
  StyleJsonVectorSource,
} from '../../hooks/use-mapbox-json-style';
import {
  Expression,
  FilterExpression,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';

import {
  hideItemsInTheDistanceFilter,
  scaleTransitionZoomRange,
} from '../../hooks/use-map-symbol-styles';

const vehiclesAndStationsMinZoom = 14;
const vehiclesAndStationsMaxZoom = 17;
const vehiclesAndStationsZoomLevels = Array.from(
  {length: vehiclesAndStationsMaxZoom - vehiclesAndStationsMinZoom + 1},
  (_, i) => i + vehiclesAndStationsMinZoom,
);

const getVehiclesAndStationsVectorSourceId = (zoomLevel: number) =>
  `vehicles-clustered-and-stations-source-${zoomLevel}`;

type VehiclesWithClustersProps = SelectedFeatureIdProp & {
  minZoomLevel: number;
  hideSymbols?: boolean;
};

const VehiclesWithClusters = ({
  selectedFeatureId,
  minZoomLevel,
  hideSymbols = false,
}: VehiclesWithClustersProps) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'vehicle',
    reachFullScaleAtZoomLevel:
      minZoomLevel +
      scaleTransitionZoomRange +
      (minZoomLevel === vehiclesAndStationsMinZoom ? 0.15 : 0),
  });

  const filter: {filter: FilterExpression} | undefined = useMemo(
    () =>
      hideSymbols
        ? undefined
        : {filter: ['all', ['!', isSelected], hideItemsInTheDistanceFilter]},
    [isSelected, hideSymbols],
  );

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id={`vehicles-clustered-symbol-layer-${minZoomLevel}-${
        hideSymbols ? 'hidden' : 'visible'
      }`}
      sourceID={getVehiclesAndStationsVectorSourceId(minZoomLevel)}
      sourceLayerID="combined_layer"
      minZoomLevel={minZoomLevel}
      maxZoomLevel={
        minZoomLevel === vehiclesAndStationsMaxZoom
          ? undefined
          : minZoomLevel + 1 + scaleTransitionZoomRange
      }
      aboveLayerID={MapSlotLayerId.Vehicles}
      style={hideSymbols ? {} : style}
      {...filter}
    />
  );
};

const StationsWithClusters = ({
  selectedFeatureId,
  showNonVirtualStations,
  hideSymbols = false,
  minZoomLevel,
}: SelectedFeatureIdProp & {
  showNonVirtualStations: boolean;
  hideSymbols?: boolean;
  minZoomLevel: number;
}) => {
  const showVirtualStations = false; // not supported yet. Also – consider using a virtualStationsFilter prop instead
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'station',
    reachFullScaleAtZoomLevel:
      minZoomLevel +
      scaleTransitionZoomRange +
      (minZoomLevel === vehiclesAndStationsMinZoom ? 0.05 : 0),
  });

  const {mapFilter} = useMapContext();
  const showCityBikes = mapFilter?.mobility.BICYCLE?.showAll ?? false;
  const showSharedCars = mapFilter?.mobility.CAR?.showAll ?? false;

  const filter: {filter: FilterExpression} | undefined = useMemo(() => {
    const isVirtualStation: Expression = ['get', 'is_virtual_station'];
    const vehicle_type_form_factor: Expression = [
      'get',
      'vehicle_type_form_factor',
    ];
    return hideSymbols
      ? undefined
      : {
          filter: [
            'all',
            ['!', isSelected],
            [
              'any',
              ['==', isVirtualStation, showVirtualStations],
              ['!=', isVirtualStation, showNonVirtualStations],
            ],
            [
              'any',
              [
                'all',
                ['==', vehicle_type_form_factor, 'BICYCLE'],
                ['!', !showCityBikes],
              ],
              [
                'all',
                ['==', vehicle_type_form_factor, 'CAR'],
                ['!', !showSharedCars],
              ],
            ],
            hideItemsInTheDistanceFilter,
          ],
        };
  }, [
    isSelected,
    showVirtualStations,
    showNonVirtualStations,
    showCityBikes,
    showSharedCars,
    hideSymbols,
  ]);

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
      iconAllowOverlap: true,
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id={`stations-clustered-symbol-layer-${minZoomLevel}-${
        hideSymbols ? 'hidden' : 'visible'
      }`}
      sourceID={getVehiclesAndStationsVectorSourceId(minZoomLevel)}
      sourceLayerID="combined_stations_layer"
      minZoomLevel={minZoomLevel}
      maxZoomLevel={
        minZoomLevel === vehiclesAndStationsMaxZoom
          ? undefined
          : minZoomLevel + 1 + scaleTransitionZoomRange
      }
      aboveLayerID={MapSlotLayerId.Stations}
      style={hideSymbols ? {} : style}
      {...filter}
    />
  );
};

type VehiclesAndStationsProps = SelectedFeatureIdProp & {
  onPress?: (e: OnPressEvent) => void;
  showVehicles: boolean;
  showStations: boolean;
  hideSymbols?: boolean;
};

// Vehicles and stations are grouped to optimize tile loading (limiting the number of requests)
export const VehiclesAndStations = ({
  selectedFeatureId,
  onPress,
  showVehicles,
  showStations,
  hideSymbols = false,
}: VehiclesAndStationsProps) => {
  if (!showVehicles && !showStations) return null;
  return vehiclesAndStationsZoomLevels.map((zoomLevel) => (
    <MapboxGL.VectorSource
      key={`${zoomLevel}`}
      id={getVehiclesAndStationsVectorSourceId(zoomLevel)}
      existing={true}
      hitbox={hitboxCoveringIconOnly}
      onPress={onPress}
    >
      <>
        {!!showVehicles && (
          <VehiclesWithClusters
            selectedFeatureId={selectedFeatureId}
            minZoomLevel={zoomLevel}
            hideSymbols={hideSymbols}
          />
        )}
        {!!showStations && (
          <StationsWithClusters
            selectedFeatureId={selectedFeatureId}
            showNonVirtualStations={true}
            minZoomLevel={zoomLevel}
            hideSymbols={hideSymbols}
          />
        )}
      </>
    </MapboxGL.VectorSource>
  ));
};

/**
 * In order to only store live data in memory, not in the locally stored cache,
 * volatile should be set to true. However, since rnmapbox doesn't yet support
 * this prop on MapboxGL.VectorSource (see https://github.com/rnmapbox/maps/discussions/3351),
 * the source must instead be sent directly as styleJson. MapboxGL.VectorSource can
 * then access this source with existing=true and the same source id.
 * @returns {id: string, source: StyleJsonVectorSource}
 */
export const useVehiclesAndStationsVectorSource: () => {
  [key: string]: StyleJsonVectorSource;
} = () => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = [
    'vehicles_clustered_v2',
    'stations_clustered_v2',
  ];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);

  return useMemo(() => {
    const vehiclesAndStationsVectorSources: {
      [key: string]: StyleJsonVectorSource;
    } = {};
    vehiclesAndStationsZoomLevels.forEach((zoomLevel) => {
      vehiclesAndStationsVectorSources[
        getVehiclesAndStationsVectorSourceId(zoomLevel)
      ] = {
        type: 'vector',
        tiles: [tileUrlTemplate || ''],
        minzoom: zoomLevel,
        maxzoom: zoomLevel,
        volatile: true,
      };
    });
    return vehiclesAndStationsVectorSources;
  }, [tileUrlTemplate]);
};
