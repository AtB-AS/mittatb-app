import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSymbolStyles} from '@atb/components/map';

type SelectedFeatureProp = {
  selectedFeature: Feature<Point, GeoJsonProperties> | undefined;
};

const vehiclesAndStationsVectorSourceId =
  'vehicles-clustered-and-stations-source';

export const VehiclesWithClusters = ({
  selectedFeature,
}: SelectedFeatureProp) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeature,
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

export const Stations = ({selectedFeature}: SelectedFeatureProp) => {
  const {isSelected, iconStyle, textStyle} = useMapSymbolStyles(
    selectedFeature,
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

export const VehiclesAndStations = ({selectedFeature}: SelectedFeatureProp) => (
  <MapboxGL.VectorSource
    id={vehiclesAndStationsVectorSourceId}
    minZoomLevel={14}
    maxZoomLevel={19}
    tileUrlTemplates={[
      // TODO: add URL from remote config here
      'http://localhost:8080/mobility/v1/tiles/vehicles_clustered,stations/{z}/{x}/{y}',
    ]}
  >
    <VehiclesWithClusters selectedFeature={selectedFeature} />
    <Stations selectedFeature={selectedFeature} />
  </MapboxGL.VectorSource>
);
