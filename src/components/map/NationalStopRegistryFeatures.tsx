import React from 'react';
import {MAPBOX_NSR_TILESET_ID} from '@env';
import {
  useNsrCircleLayers,
  useNsrTextLayers,
  useNsrSymbolLayers,
} from './hooks/useNsrSymbolLayers';
import MapboxGL from '@rnmapbox/maps';
import {SelectedFeatureProp} from './types';

export const NationalStopRegistryFeatures = ({
  selectedFeature,
}: SelectedFeatureProp) => {
  const nsrSymbolLayers = useNsrSymbolLayers(selectedFeature);
  const nsrCircleLayers = useNsrCircleLayers(selectedFeature);
  const nsrTextLayers = useNsrTextLayers(selectedFeature);

  return (
    <MapboxGL.VectorSource
      id="stop-places-source"
      url={`mapbox://${MAPBOX_NSR_TILESET_ID}`}
    >
      <>
        {nsrCircleLayers.map((nsrCircleLayer) => (
          <MapboxGL.CircleLayer key={nsrCircleLayer.id} {...nsrCircleLayer} />
        ))}
        {[...nsrSymbolLayers, ...nsrTextLayers].map((nsrLayer) => (
          <MapboxGL.SymbolLayer key={nsrLayer.id} {...nsrLayer} />
        ))}
      </>
    </MapboxGL.VectorSource>
  );
};
