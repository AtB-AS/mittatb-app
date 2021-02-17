import {useTransportationColor} from '@atb/utils/use-transportation-color';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {View} from 'react-native';
import {MapLine, pointOf} from './utils';

const MapRoute: React.FC<{lines: MapLine[]}> = ({lines}) => {
  return (
    <>
      {lines.map((line, index) => (
        <MapLineItem key={'line-' + index} line={line} index={index} />
      ))}
    </>
  );
};

function getFirstAndLastPoint(line: MapLine): [Point, Point] {
  const coordinates = line.geometry.coordinates;
  const {0: first, [coordinates.length - 1]: last} = coordinates;
  return [pointOf(first), pointOf(last)];
}

export default MapRoute;

type MapLineItemProps = {
  line: MapLine;
  index: number;
};
function MapLineItem({line, index}: MapLineItemProps) {
  const lineColorInput = useTransportationColor(
    line?.faded ? undefined : line?.travelType,
    line?.subMode,
  );

  const lineColor = line?.faded
    ? hexToRgba(lineColorInput, 0.5)
    : lineColorInput;

  return (
    <View>
      <MapboxGL.ShapeSource id={'shape-' + index} shape={line.geometry}>
        <MapboxGL.LineLayer
          id={'line-' + index}
          style={{
            lineWidth: 4,
            lineOffset: -1,
            lineColor,
          }}
        ></MapboxGL.LineLayer>
      </MapboxGL.ShapeSource>

      <MapboxGL.ShapeSource
        id={'switch-' + index}
        shape={{
          type: 'GeometryCollection',
          geometries: getFirstAndLastPoint(line),
        }}
      >
        <MapboxGL.CircleLayer
          id={'line-symbol-' + index}
          style={{
            circleRadius: 7.5,
            circleColor: lineColor,
          }}
        ></MapboxGL.CircleLayer>
      </MapboxGL.ShapeSource>
    </View>
  );
}
