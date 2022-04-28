import {MapIcon} from '@atb/assets/svg/color/map';
import Button from '@atb/components/button';
import {MapCameraConfig, MapViewConfig} from '@atb/components/map';

import {StyleSheet, useTheme} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import useDisableMapCheck from '@atb/utils/use-disable-map-check';
import Bugsnag from '@bugsnag/react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Position} from 'geojson';
import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import MapLabel from './MapLabel';
import MapRoute from './MapRoute';
import {createMapLines, getMapBounds, pointOf} from './utils';
import {Coordinates, MapLeg} from '@atb/screens/TripDetails/Map/types';

export type MapProps = {
  mapLegs: MapLeg[];
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  onExpand?(): void;
};

export const CompactMap: React.FC<MapProps> = ({
  mapLegs,
  fromPlace,
  toPlace,
  onExpand,
}) => {
  const {themeName} = useTheme();
  const disableMap = useDisableMapCheck();
  const {t} = useTranslation();

  const features = useMemo(() => createMapLines(mapLegs), [mapLegs]);
  const bounds = useMemo(() => getMapBounds(features), [features]);

  const [loadingMap, setLoadingMap] = useState(true);
  const styles = useStyles();

  const darkmode = themeName === 'dark';

  const expandMap = () => {
    if (!loadingMap) onExpand?.();
  };

  if (disableMap) {
    return null;
  }

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
        styleURL={darkmode ? 'mapbox://styles/mapbox/dark-v10' : undefined}
        compassEnabled={false}
        onPress={expandMap}
      >
        <MapboxGL.Camera
          bounds={bounds}
          {...MapCameraConfig}
          animationDuration={0}
        />
        <MapRoute lines={features}></MapRoute>
        {toPlace && (
          <MapLabel
            point={pointOf(toPlace)}
            id={'end'}
            text={t(MapTexts.endPoint.label)}
          />
        )}
        {fromPlace && (
          <MapLabel
            point={pointOf(fromPlace)}
            id={'start'}
            text={t(MapTexts.startPoint.label)}
          />
        )}
      </MapboxGL.MapView>
      {onExpand && (
        <View style={styles.togglerContainer}>
          <Button
            style={styles.toggler}
            type="inline"
            mode="tertiary"
            onPress={expandMap}
            hitSlop={insets.symmetric(8, 12)}
            text={t(MapTexts.expandButton.label)}
            icon={MapIcon}
          ></Button>
        </View>
      )}
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
    textShadowColor: theme.static.background.background_0.background,
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
