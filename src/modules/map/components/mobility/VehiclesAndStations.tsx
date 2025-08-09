import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {
  hitboxCoveringIconOnly,
  useMapContext,
  useMapSymbolStyles,
} from '@atb/modules/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

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
} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {scaleTransitionZoomRange} from '../../hooks/use-map-symbol-styles';

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

const vehiclesAndStationsMinZoom = 14;
const vehiclesAndStationsMaxZoom = 17;
const vehiclesAndStationsZoomLevels = Array.from(
  {length: vehiclesAndStationsMaxZoom - vehiclesAndStationsMinZoom + 1},
  (_, i) => i + vehiclesAndStationsMinZoom,
);

type VehiclesWithClustersProps = SelectedFeatureIdProp & {
  minZoomLevel: number;
  /** Whether to draw the icons or not. Useful for optimizing tile preloading performance. */
  hideSymbols?: boolean;
};

export const VehiclesWithClusters = ({
  selectedFeatureId,
  minZoomLevel,
  hideSymbols,
}: VehiclesWithClustersProps) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'vehicle',
    reachFullScaleAtZoomLevel:
      minZoomLevel +
      scaleTransitionZoomRange +
      (minZoomLevel === vehiclesAndStationsMinZoom ? 0.15 : 0),
  });

  const filter: FilterExpression = useMemo(
    () => ['all', ['!', isSelected]],
    [isSelected],
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
      id={`vehicles-clustered-symbol-layer-${minZoomLevel}`}
      sourceID={vehiclesAndStationsVectorSourceId + minZoomLevel.toString()}
      sourceLayerID="combined_layer"
      minZoomLevel={minZoomLevel}
      maxZoomLevel={
        minZoomLevel === vehiclesAndStationsMaxZoom
          ? undefined
          : minZoomLevel + 1 + scaleTransitionZoomRange
      }
      aboveLayerID={MapSlotLayerId.Vehicles}
      filter={hideSymbols ? JSON.stringify(['==', 1, 0]) : filter}
      style={hideSymbols ? undefined : style}
    />
  );
};

export const Stations = ({
  selectedFeatureId,
  showNonVirtualStations,
}: SelectedFeatureIdProp & {
  showNonVirtualStations: boolean;
}) => {
  const showVirtualStations = false; // not supported yet. Also – consider using a virtualStationsFilter prop instead
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'station',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.2,
  });

  const {mapFilter} = useMapContext();
  const showCityBikes = mapFilter?.mobility.BICYCLE?.showAll ?? false;
  const showSharedCars = mapFilter?.mobility.CAR?.showAll ?? false;

  const filter: FilterExpression = useMemo(() => {
    const isVirtualStation: Expression = ['get', 'is_virtual_station'];
    const vehicle_type_form_factor: Expression = [
      'get',
      'vehicle_type_form_factor',
    ];
    return [
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
    ];
  }, [
    isSelected,
    showVirtualStations,
    showNonVirtualStations,
    showCityBikes,
    showSharedCars,
  ]);

  const style = useMemo(
    () => ({
      ...iconStyle,
      ...textStyle,
      iconAllowOverlap: false, // todo: server side clustering for stations
    }),
    [iconStyle, textStyle],
  );

  return (
    <MapboxGL.SymbolLayer
      id="stations-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="stations"
      minZoomLevel={minZoomLevel}
      aboveLayerID={MapSlotLayerId.Stations}
      filter={filter}
      style={style}
    />
  );
};

type VehiclesAndStationsProps = SelectedFeatureIdProp & {
  onPress?: (e: OnPressEvent) => void;
  showVehicles: boolean;
  showStations: boolean;
  isPreloader?: boolean;
};

// Vehicles and stations are grouped to optimize tile loading (limiting the number of requests)
export const VehiclesAndStations = ({
  selectedFeatureId,
  onPress,
  showVehicles,
  showStations,
  isPreloader,
}: VehiclesAndStationsProps) => {
  if (!showVehicles && !showStations) return null;

  return vehiclesAndStationsZoomLevels.map((zoomLevel) => (
    <MapboxGL.VectorSource
      key={zoomLevel.toString()}
      id={vehiclesAndStationsVectorSourceId + zoomLevel.toString()}
      existing={true}
      hitbox={hitboxCoveringIconOnly}
      onPress={onPress}
    >
      <>
        {!!showVehicles && (
          <VehiclesWithClusters
            selectedFeatureId={selectedFeatureId}
            minZoomLevel={zoomLevel}
            hideSymbols={isPreloader}
          />
        )}
        {!!showStations && false && (
          <Stations
            selectedFeatureId={selectedFeatureId}
            showNonVirtualStations={true}
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
  const tileLayerNames: TileLayerName[] = ['vehicles_clustered', 'stations'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);

  return useMemo(() => {
    const vehiclesAndStationsVectorSources: {
      [key: string]: StyleJsonVectorSource;
    } = {};
    vehiclesAndStationsZoomLevels.forEach((zoomLevel) => {
      vehiclesAndStationsVectorSources[
        vehiclesAndStationsVectorSourceId + zoomLevel.toString()
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
