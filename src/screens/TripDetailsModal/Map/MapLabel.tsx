import React from 'react';
import MapboxGL, {SymbolLayerStyle} from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import colors from '../../../theme/colors';

const MapLabel: React.FC<{
  text: string;
  point: Point;
  id: string;
}> = ({text, point, id}) => {
  const bg = require('../../../assets/images/map/mapLabelBg.png');
  const shape = {
    type: 'Feature',
    geometry: point,
    properties: {
      icon: 'background',
    },
  };
  return (
    <>
      <MapboxGL.Images images={{background: bg}} />
      <MapboxGL.ShapeSource id={id + '-shape'} shape={shape}>
        <MapboxGL.SymbolLayer
          id={id + '-label'}
          style={{
            textColor: colors.general.white,
            textHaloColor: colors.primary.gray,
            textHaloWidth: 1,
            textField: text,
            iconImage: ['get', 'icon'],
            iconAllowOverlap: true,
            iconOpacity: 1,
            iconSize: 0.33,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
export default MapLabel;
