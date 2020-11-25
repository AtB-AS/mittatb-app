import React, {useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MapIcon} from '../../../assets/svg/map';
import {getMapBounds, legsToMapLines, pointOf} from './utils';
import MapRoute from './MapRoute';
import MapLabel from './MapLabel';
import {MapViewConfig, MapCameraConfig} from '../../../components/map/';
import insets from '../../../utils/insets';
import {Leg} from '../../../sdk';
import Bugsnag from '@bugsnag/react-native';
import {StyleSheet} from '../../../theme';
import Button from '../../../components/button';

export type MapProps = {
  legs: Leg[];
  darkMode?: boolean;
  onExpand(): void;
};

export const CompactMap: React.FC<MapProps> = ({legs, darkMode, onExpand}) => {
  const features = legsToMapLines(legs);
  const startPoint = pointOf(legs[0].fromPlace);
  const endPoint = pointOf(legs[legs.length - 1].toPlace);
  const bounds = getMapBounds(features);

  const [loadingMap, setLoadingMap] = useState(true);
  const styles = useStyles();

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
        styleURL={darkMode ? 'mapbox://styles/mapbox/dark-v10' : undefined}
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
        <Button
          style={styles.toggler}
          type="inline"
          mode="tertiary"
          onPress={expandMap}
          hitSlop={insets.symmetric(8, 12)}
          text="Utvid kart"
          icon={MapIcon}
        ></Button>
      </View>
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
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
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
  },
  toggleText: {
    textShadowColor: theme.background.level0,
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 1,
  },
  toggleIcon: {
    marginLeft: theme.spacings.xSmall,
  },
}));

function log(message: string) {
  Bugsnag.leaveBreadcrumb(message, {component: 'CompactMap'});
}

export default CompactMap;
