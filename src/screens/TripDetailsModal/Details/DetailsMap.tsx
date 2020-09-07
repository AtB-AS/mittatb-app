import React, {useRef, useState} from 'react';
import MapboxGL, {
  LineLayerStyle,
  SymbolLayerStyle,
} from '@react-native-mapbox-gl/maps';
import {StyleSheet, View, Text, TouchableOpacity, Animated} from 'react-native';
import {useGeolocationState} from '../../../GeolocationContext';
import MapControls from '../../../location-search/map-selection/MapControls';
import {Leg, LegMode, Place} from '@entur/sdk';
import {transportationMapLineColor} from '../../../utils/transportation-color';
import {Feature, LineString, Position, Point} from 'geojson';
import {MapIcon} from '../../../assets/svg/map';
import colors from '../../../theme/colors';

export type Props = {
  legs: Leg[];
  expanded?: boolean;
};

const COMPACT_HEIGHT = 96;
const FULL_HEIGHT = 400;
const HEIGHT_DIFFERENCE = FULL_HEIGHT - COMPACT_HEIGHT;

interface MapLine extends Feature {
  travelType?: LegMode;
  publicCode?: string;
}

export const TravelDetailsMap: React.FC<Props> = (props) => {
  const polyline = require('@mapbox/polyline');
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  const animOffset = useRef<Animated.Value>(
    new Animated.Value(-HEIGHT_DIFFERENCE),
  ).current;

  const {location: geolocation} = useGeolocationState();
  const [expanded, setExpanded] = useState<boolean>(props.expanded ?? false);

  const features: MapLine[] = props.legs.map((leg) => {
    const line = polyline.toGeoJSON(leg.pointsOnLink?.points);
    return {
      type: 'Feature',
      properties: {},
      travelType: leg.mode,
      publicCode: leg.line?.publicCode,
      geometry: line as LineString,
    };
  });
  const startPoint = pointOf(props.legs[0].fromPlace);
  const endPoint = pointOf(props.legs[props.legs.length - 1].toPlace);
  const bounds = {
    ne: [
      Math.min(startPoint.coordinates[0], endPoint.coordinates[0]),
      Math.max(startPoint.coordinates[1], endPoint.coordinates[1]),
    ],
    sw: [
      Math.max(startPoint.coordinates[0], endPoint.coordinates[0]),
      Math.min(startPoint.coordinates[1], endPoint.coordinates[1]),
    ],
    padding: 10,
    paddingTop: HEIGHT_DIFFERENCE + 10,
  };
  const midPoint = pointOf([
    (bounds.ne[0] + bounds.sw[0]) / 2,
    (bounds.ne[1] + bounds.sw[1]) / 2,
  ]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: animOffset,
          },
        ],
        ...styles.mapView,
      }}
    >
      <MapboxGL.MapView
        ref={mapViewRef}
        style={styles.map}
        scrollEnabled={expanded}
        rotateEnabled={expanded}
        zoomEnabled={expanded}
      >
        <MapboxGL.Camera ref={mapCameraRef} bounds={bounds} />
        <MapRoute lines={features}></MapRoute>
        <MapLabel point={endPoint} id={'end'} text="Slutt"></MapLabel>
        <MapLabel point={startPoint} id={'start'} text="Start"></MapLabel>
      </MapboxGL.MapView>
      {expanded && (
        <View style={styles.controls}>
          <MapControls
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            flyToCurrentLocation={flyToCurrentLocation}
          />
        </View>
      )}
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.mapToggler}
        onPress={toggleExpanded}
      >
        <Text style={styles.toggleText}>
          {!expanded ? 'Utvid kart' : 'Mindre kart'}
        </Text>
        <MapIcon />
      </TouchableOpacity>
    </Animated.View>
  );

  function toggleExpanded() {
    const newExpanded = !expanded;
    Animated.timing(animOffset, {
      useNativeDriver: true,
      toValue: newExpanded ? 0 : -HEIGHT_DIFFERENCE,
      duration: 250,
    }).start();
    setExpanded(newExpanded);
    flyToCenter();
  }
  async function flyToCenter() {
    mapCameraRef.current?.fitBounds(bounds.ne, bounds.sw, 10, 250);
    mapCameraRef.current?.flyTo(midPoint.coordinates, 750);
  }
  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }
  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation?.coords.longitude, geolocation?.coords.latitude],
        750,
      );
  }
};
function pointOf(place: Place): Point;
function pointOf(coordinates: Position): Point;
function pointOf(placing: any): Point {
  let coords: Position;
  if (Array.isArray(placing)) {
    coords = placing;
  } else {
    coords = [placing.longitude, placing.latitude];
  }
  return {
    type: 'Point',
    coordinates: coords,
  };
}

const styles = StyleSheet.create({
  mapView: {
    zIndex: 1,
    marginBottom: -HEIGHT_DIFFERENCE,
  },
  map: {
    height: FULL_HEIGHT,
    width: '100%',
  },
  controls: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  mapToggler: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignSelf: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  toggleText: {
    fontSize: 14,
    marginRight: 4,
  },
});

const mapLabelStyle: SymbolLayerStyle = {
  textColor: colors.general.black,
  textHaloColor: colors.general.white,
  textHaloWidth: 2,
};
const MapLabel: React.FC<{text: string; point: Point; id: string}> = ({
  text,
  point,
  id,
}) => {
  return (
    <MapboxGL.ShapeSource id={id + '-shape'} shape={point}>
      <MapboxGL.SymbolLayer
        id={id + '-text'}
        minZoomLevel={7}
        style={{
          ...mapLabelStyle,
          textField: text,
        }}
      ></MapboxGL.SymbolLayer>
    </MapboxGL.ShapeSource>
  );
};
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
