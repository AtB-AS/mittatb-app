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
import {
  pitchBasedDistanceFilter,
  scaleTransitionZoomRange,
} from '../../hooks/use-map-symbol-styles';

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

export const VehiclesWithClusters = ({
  selectedFeatureId,
}: SelectedFeatureIdProp) => {
  const minZoomLevel = 14;
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles({
    selectedFeaturePropertyId: selectedFeatureId,
    pinType: 'vehicle',
    reachFullScaleAtZoomLevel: minZoomLevel + scaleTransitionZoomRange + 0.3,
  });

  const filter: FilterExpression = useMemo(
    () => ['all', ['!', isSelected], pitchBasedDistanceFilter],
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
      id="vehicles-clustered-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_layer"
      minZoomLevel={minZoomLevel}
      aboveLayerID={MapSlotLayerId.Vehicles}
      filter={filter}
      style={style}
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
      pitchBasedDistanceFilter,
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

// Vehicles and stations are grouped to optimize tile loading (limiting the number of requests)
export const VehiclesAndStations = ({
  selectedFeatureId,
  onPress,
  showVehicles,
  showStations,
}: SelectedFeatureIdProp & {
  onPress?: (e: OnPressEvent) => void;
  showVehicles: boolean;
  showStations: boolean;
}) => {
  if (!showVehicles && !showStations) return null;

  return (
    <MapboxGL.VectorSource
      id={vehiclesAndStationsVectorSourceId}
      existing={true}
      hitbox={hitboxCoveringIconOnly}
      onPress={onPress}
    >
      <>
        {!!showVehicles && (
          <VehiclesWithClusters selectedFeatureId={selectedFeatureId} />
        )}
        {!!showStations && (
          <Stations
            selectedFeatureId={selectedFeatureId}
            showNonVirtualStations={true}
          />
        )}
      </>
    </MapboxGL.VectorSource>
  );
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
  id: string;
  source: StyleJsonVectorSource;
} = () => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = ['vehicles_clustered', 'stations'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);

  return useMemo(
    () => ({
      id: vehiclesAndStationsVectorSourceId,
      source: {
        type: 'vector',
        tiles: [tileUrlTemplate || ''],
        minzoom: 14,
        maxzoom: 19,
        volatile: true,
      },
    }),
    [tileUrlTemplate],
  );
};
