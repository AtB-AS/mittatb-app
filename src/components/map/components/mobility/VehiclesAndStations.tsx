import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/components/map';
import {SelectedFeatureIdProp} from '../../types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

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
      hitbox={hitboxCoveringIconOnly}
      minZoomLevel={14}
      maxZoomLevel={19}
      tileUrlTemplates={[
        // TODO: add URL from remote config here
        // consider: only load the source used?
        'http://localhost:8080/mobility/v1/tiles/vehicles_clustered,stations/{z}/{x}/{y}',
      ]}
      onPress={onPress}
    >
      <>
        {showVehicles && (
          <VehiclesWithClusters selectedFeatureId={selectedFeatureId} />
        )}
        {showStations && <Stations selectedFeatureId={selectedFeatureId} />}
      </>
    </MapboxGL.VectorSource>
  );
};
