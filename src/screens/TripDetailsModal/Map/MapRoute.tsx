import {LegMode} from '@entur/sdk';
import MapboxGL, {LineLayerStyle} from '@react-native-mapbox-gl/maps';
import {LineString} from 'geojson';
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
  function getFirstPoint(line: MapLine) {
    const coordinates = (line.geometry as LineString).coordinates;
    return pointOf(coordinates[0]);
  }
  return (
    <>
      {lines.map((line, index) => {
        const isFirst = index === 0;
        return (
          <View key={'line-' + index}>
            <MapboxGL.ShapeSource id={'shape-' + index} shape={line.geometry}>
              <MapboxGL.LineLayer
                id={'line-' + index}
                style={{
                  lineWidth: 5,
                  lineJoin: 'round',
                  ...modeStyle(line.travelType, line.publicCode),
                }}
              ></MapboxGL.LineLayer>
            </MapboxGL.ShapeSource>

            {!isFirst && (
              <MapboxGL.ShapeSource
                id={'switch-' + index}
                shape={getFirstPoint(line)}
              >
                <MapboxGL.CircleLayer
                  id={'switch-circle-' + index}
                  style={{
                    circleRadius: 7,
                    circleColor: transportationMapLineColor(
                      line.travelType,
                      line.publicCode,
                    ),
                  }}
                ></MapboxGL.CircleLayer>
              </MapboxGL.ShapeSource>
            )}
          </View>
        );
      })}
    </>
  );
};
export default MapRoute;
