import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import colors from '../../../theme/colors';

const MapLabel: React.FC<{
  text: string;
  point: Point;
  id: string;
}> = ({text, point, id}) => {
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
            textColor: colors.general.white,
            textHaloColor: colors.primary.gray,
            textHaloWidth: 2,
            textField: text,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
export default MapLabel;
