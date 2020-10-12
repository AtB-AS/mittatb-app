import React, {useRef, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MapIcon} from '../../../assets/svg/map';
import {getMapBounds, legsToMapLines, pointOf} from './utils';
import MapRoute from './MapRoute';
import MapLabel from './MapLabel';
import colors from '../../../theme/colors';
import {MapViewConfig, MapCameraConfig} from '../../../components/map/';
import insets from '../../../utils/insets';
import {Leg} from '../../../sdk';
import Bugsnag from '@bugsnag/react-native';

export type MapProps = {
  legs: Leg[];
  onExpand(): void;
};

export const CompactMap: React.FC<MapProps> = ({legs, onExpand}) => {
  const features = legsToMapLines(legs);
  const startPoint = pointOf(legs[0].fromPlace);
  const endPoint = pointOf(legs[legs.length - 1].toPlace);
  const bounds = getMapBounds(features);

  const [loadingMap, setLoadingMap] = useState(true);

  const expandMap = () => {
    if (!loadingMap) onExpand();
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        scrollEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        onWillStartRenderingMap={() => log('Start loading map')}
        onDidFinishRenderingMapFully={() => {
          setLoadingMap(false);
          log('Finished loading map');
        }}
        {...MapViewConfig}
        styleURL={undefined}
        compassEnabled={false}
        onPress={expandMap}
      >
        <MapboxGL.Camera
          bounds={bounds}
          {...MapCameraConfig}
          animationDuration={0}
        />
        <MapRoute lines={features}></MapRoute>
        <MapLabel point={endPoint} id={'end'} text="Slutt"></MapLabel>
        <MapLabel point={startPoint} id={'start'} text="Start"></MapLabel>
      </MapboxGL.MapView>
      <View style={styles.togglerContainer}>
        <TouchableOpacity
          style={styles.toggler}
          onPress={expandMap}
          hitSlop={insets.symmetric(8, 12)}
        >
          <Text style={styles.toggleText}>Utvid kart</Text>
          <MapIcon style={styles.toggleIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {height: 160},
  map: {
    width: '100%',
    height: '100%',
  },
  togglerContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  toggler: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.general.black,
    textShadowColor: colors.general.white,
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 1,
  },
  toggleIcon: {
    marginLeft: 4,
  },
});

function log(message: string) {
  Bugsnag.leaveBreadcrumb(message, {component: 'CompactMap'});
}

export default CompactMap;
