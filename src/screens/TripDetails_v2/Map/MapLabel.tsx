import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import {useTheme} from '@atb/theme';

const MapLabel: React.FC<{
  text: string;
  point: Point;
  id: string;
}> = ({text, point, id}) => {
  const {theme} = useTheme();
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
            textColor: theme.colors.background_accent.color,
            textHaloColor: theme.colors.background_accent.backgroundColor,
            textHaloWidth: 2,
            textField: text,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
export default MapLabel;
