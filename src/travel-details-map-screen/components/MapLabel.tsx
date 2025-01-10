import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {Point} from 'geojson';
import {useThemeContext} from '@atb/theme';

export const MapLabel: React.FC<{
  text: string;
  point: Point;
  id: string;
}> = ({text, point, id}) => {
  const {theme} = useThemeContext();
  const shape: GeoJSON.Feature = {
    type: 'Feature',
    geometry: point,
    properties: {},
  };
  return (
    <>
      <MapboxGL.ShapeSource id={id + '-shape'} shape={shape}>
        <MapboxGL.SymbolLayer
          id={id + '-label'}
          style={{
            textColor: theme.color.background.accent[0].foreground.primary,
            textHaloColor: theme.color.background.accent[0].background,
            textHaloWidth: 2,
            textField: text,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
