import React, {useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Location} from '@atb/modules/favorites';
import {useThemeContext} from '@atb/theme';
import {MapSlotLayerId} from '../hooks/use-mapbox-json-style';
import {locationToFeature} from '../location-to-feature';

export const SelectedLocationPin = ({location}: {location: Location}) => {
  const {themeName} = useThemeContext();
  const feature = useMemo(
    () => ({...locationToFeature(location), id: location.id}),
    [location],
  );

  return (
    <MapboxGL.ShapeSource id="selected-location-source" shape={feature}>
      <MapboxGL.SymbolLayer
        id="selected-location-symbol-layer"
        aboveLayerID={MapSlotLayerId.SelectedFeature}
        style={{
          iconImage: `interactivepin_default_${themeName}`,
          iconAnchor: 'bottom',
          iconAllowOverlap: true,
          iconSize: 1,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
