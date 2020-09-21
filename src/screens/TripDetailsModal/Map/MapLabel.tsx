import React from 'react';
import MapboxGL, {SymbolLayerStyle} from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import colors from '../../../theme/colors';

const MapLabel: React.FC<{text: string; point: Point; id: string}> = ({
  text,
  point,
  id,
}) => {
  return (
    <MapboxGL.ShapeSource id={id + '-shape'} shape={point}>
      <MapboxGL.SymbolLayer
        id={id + '-text'}
        sourceLayerID={id + '-shape'}
        minZoomLevel={7}
        style={{
          ...mapLabelStyle,
          textField: text,
          textHaloWidth: 2,
          textHaloColor: colors.general.white,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

const mapLabelStyle: SymbolLayerStyle = {
  textColor: colors.general.black,
  textHaloColor: colors.general.white,
  textHaloWidth: 2,
};

export default MapLabel;
