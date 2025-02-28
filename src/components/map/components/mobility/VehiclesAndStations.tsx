import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/components/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {StyleJsonVectorSource} from '../../hooks/use-mapbox-json-style';

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

export const VehiclesWithClusters = ({
  selectedFeatureId,
}: SelectedFeatureIdProp) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeatureId,
    'vehicle',
  );
  return (
    <MapboxGL.SymbolLayer
      id="vehicles-clustered-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="combined_layer"
      minZoomLevel={14}
      filter={['!', isSelected]}
      style={{
        ...iconStyle,
        ...textStyle,
      }}
    />
  );
};

export const Stations = ({selectedFeatureId}: SelectedFeatureIdProp) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeatureId,
    'station',
  );
  return (
    <MapboxGL.SymbolLayer
      id="stations-symbol-layer"
      sourceID={vehiclesAndStationsVectorSourceId}
      sourceLayerID="stations"
      minZoomLevel={14}
      filter={['!', isSelected]}
      style={{
        ...iconStyle,
        ...textStyle,
        iconAllowOverlap: false, // todo: server side clustering for stations
      }}
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
        {!!showStations && <Stations selectedFeatureId={selectedFeatureId} />}
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
