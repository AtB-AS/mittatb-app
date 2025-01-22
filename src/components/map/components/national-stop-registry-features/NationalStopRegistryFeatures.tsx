import React from 'react';
import {MAPBOX_NSR_TILESET_ID} from '@env';

import MapboxGL from '@rnmapbox/maps';
import {useNsrCircleLayers} from './use-nsr-circle-layers';
import {useNsrSymbolLayers} from './use-nsr-symbol-layers';

/**
 * @property {string} selectedFeaturePropertyId - Should be the id from properties, which is the NSR id. This is needed to hide the selected feature.
 */
export type NsrProps = {
  selectedFeaturePropertyId?: string;
};

// For data from National Stop Registry (NSR) (See https://stoppested.entur.org and https://developer.entur.org/pages-nsr-nsr)
export const NationalStopRegistryFeatures = ({
  selectedFeaturePropertyId,
}: NsrProps) => {
  const nsrCircleLayers = useNsrCircleLayers(selectedFeaturePropertyId);
  const nsrSymbolLayers = useNsrSymbolLayers(selectedFeaturePropertyId);

  return (
    <MapboxGL.VectorSource
      id="nsr-layers-source"
      url={`mapbox://${MAPBOX_NSR_TILESET_ID}`}
    >
      <>
        {nsrSymbolLayers.map((nsrSymbolLayer) => (
          <MapboxGL.SymbolLayer
            key={nsrSymbolLayer.id}
            {...nsrSymbolLayer}
            aboveLayerID="country-label"
          />
        ))}
        {nsrCircleLayers.map((nsrCircleLayer) => (
          <MapboxGL.CircleLayer
            key={nsrCircleLayer.id}
            {...nsrCircleLayer}
            aboveLayerID="country-label"
          />
        ))}
      </>
    </MapboxGL.VectorSource>
  );
};
