import {LegMode} from '@entur/sdk';
import MapboxGL, {LineLayerStyle} from '@react-native-mapbox-gl/maps';
import {Point} from 'geojson';
import React from 'react';
import {View} from 'react-native';
import {transportationMapLineColor} from '../../../utils/transportation-color';
import {MapLine, pointOf} from './utils';

const MapRoute: React.FC<{lines: MapLine[]}> = ({lines}) => {
  function modeStyle(mode?: LegMode, publicCode?: string): LineLayerStyle {
    return {
      lineColor: transportationMapLineColor(mode, publicCode),
    };
  }
  function getFirstAndLastPoint(line: MapLine): [Point, Point] {
    const coordinates = line.geometry.coordinates;
    const {0: first, [coordinates.length - 1]: last} = coordinates;
    return [pointOf(first), pointOf(last)];
  }

  return (
    <>
      {lines.map((line, index) => {
        const lineModeStyle = modeStyle(line.travelType, line.publicCode);

        return (
          <View key={'line-' + index}>
            <MapboxGL.ShapeSource id={'shape-' + index} shape={line.geometry}>
              <MapboxGL.LineLayer
                id={'line-' + index}
                style={{
                  lineWidth: 4,
                  lineOffset: -1,
                  ...lineModeStyle,
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
                  circleColor: lineModeStyle.lineColor,
                }}
              ></MapboxGL.CircleLayer>
            </MapboxGL.ShapeSource>
          </View>
        );
      })}
    </>
  );
};
export default MapRoute;
