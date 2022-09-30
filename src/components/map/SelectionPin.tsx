import {
  SelectionPinConfirm,
  SelectionPinShadow,
} from '@atb/assets/svg/color/map';
import React from 'react';
import {View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@entur/sdk';
import { Point } from "geojson";

const SelectionPin = ({
  selectedCoordinates,
}: {
  selectedCoordinates?: Coordinates;
}) => {
  if (!selectedCoordinates) return null;
  const feat = MapboxGL.geoUtils.makeFeature<Point>({
    type: 'Point',
    coordinates: [selectedCoordinates.longitude, selectedCoordinates.latitude],
  });
  const coll = MapboxGL.geoUtils.makeFeatureCollection<Point>([feat])
  console.log('THE PIN', selectedCoordinates);
  return (
    <MapboxGL.ShapeSource
      id="pinSelection"
      shape={coll}
    >
      {/*<MapboxGL.SymbolLayer*/}
      {/*  id={'symbolLocationSymbols' + 2}*/}
      {/*  minZoomLevel={1}*/}
      {/*  // style={styles.icon}*/}
      {/*>*/}
      {/*  <SelectionPinConfirm width={40} height={40} />*/}
      <MapboxGL.SymbolLayer
        id={`label-symbol-2`}
        style={{
          textSize: 20,
          textField: 'TEST',
          textHaloColor: 'white',
          textHaloWidth: 2,
        }}
      />
      {/*</MapboxGL.SymbolLayer>*/}
    </MapboxGL.ShapeSource>
  );
};

export default SelectionPin;
