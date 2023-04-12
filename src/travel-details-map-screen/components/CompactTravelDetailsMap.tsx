import {MapIcon} from '@atb/assets/svg/color/map';
import {Button} from '@atb/components/button';
import {MapCameraConfig, MapLeg, MapViewConfig} from '@atb/components/map';

import {StyleSheet, useTheme} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import useDisableMapCheck from '@atb/utils/use-disable-map-check';
import MapboxGL from '@rnmapbox/maps';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, View} from 'react-native';
import MapLabel from './MapLabel';
import MapRoute from './MapRoute';
import {createMapLines, getMapBounds, pointOf} from '../utils';
import {Coordinates} from '@atb/utils/coordinates';

export type MapProps = {
  mapLegs: MapLeg[];
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  onExpand?(): void;
};

export const CompactTravelDetailsMap: React.FC<MapProps> = ({
  mapLegs,
  fromPlace,
  toPlace,
  onExpand,
}) => {
  const {themeName} = useTheme();
  const disableMap = useDisableMapCheck();
  const {t} = useTranslation();
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const features = useMemo(() => createMapLines(mapLegs), [mapLegs]);
  const bounds = useMemo(() => getMapBounds(features), [features]);

  /*
   * Workaround for iOS as setting default bounds on camera is not working fully
   * as expected. This will on iOS give a quick zooming-out effect when opening
   * a travel search result, but this is acceptable for now.
   * https://github.com/rnmapbox/maps/issues/2705
   */
  useEffect(() => {
    if (Platform.OS === 'ios') {
      setTimeout(
        () =>
          cameraRef.current?.fitBounds(bounds.ne, bounds.sw, undefined, 100),
        100,
      );
    }
  }, [bounds]);

  const styles = useStyles();

  const darkmode = themeName === 'dark';

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
        {...MapViewConfig}
        styleURL={darkmode ? 'mapbox://styles/mapbox/dark-v10' : undefined}
        compassEnabled={false}
        onPress={onExpand}
      >
        <MapboxGL.Camera
          {...MapCameraConfig}
          defaultSettings={{bounds}}
          ref={cameraRef}
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
            onPress={onExpand}
            hitSlop={insets.symmetric(8, 12)}
            text={t(MapTexts.expandButton.label)}
            leftIcon={{svg: MapIcon}}
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
