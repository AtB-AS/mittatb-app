import React from 'react';
import {useStopPlaceSymbolLayers} from './hooks/useStopPlaceSymbolLayers';
import MapboxGL from '@rnmapbox/maps';
import {SelectedFeatureProp} from './types';

export const StopPlaceMapItems = ({selectedFeature}: SelectedFeatureProp) => {
  const stopPlaceSymbolLayers = useStopPlaceSymbolLayers(selectedFeature);

  return (
    <MapboxGL.VectorSource
      id="stop-places-source"
      url="mapbox://mittatb.3hi4kb3o" // fix - OMS url
    >
      <>
        {stopPlaceSymbolLayers.map((stopPlaceSymbolLayer) => (
          <MapboxGL.SymbolLayer
            key={stopPlaceSymbolLayer.id}
            {...stopPlaceSymbolLayer}
          />
        ))}
      </>
    </MapboxGL.VectorSource>
  );
};
