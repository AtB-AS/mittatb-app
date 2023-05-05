import {MapCameraConfig, MapLeg, MapViewConfig} from '@atb/components/map';

import {StyleSheet, useTheme} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import {useDisableMapCheck} from '@atb/utils/use-disable-map-check';
import MapboxGL from '@rnmapbox/maps';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {MapLabel} from './MapLabel';
import {MapRoute} from './MapRoute';
import {createMapLines, getMapBounds, pointOf} from '../utils';
import {Coordinates} from '@atb/utils/coordinates';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

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
    <>
      <View style={styles.mapContainer}>
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
      </View>
      <TouchableOpacity style={styles.button}>
        <ThemeText type={'body__secondary--bold'} color={'primary'}>
          {t(MapTexts.showTrip.label)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} />
      </TouchableOpacity>
    </>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  mapContainer: {
    height: 120,
    borderTopRightRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacings.medium,
    backgroundColor: theme.static.background.background_1.background,
    borderBottomRightRadius: theme.border.radius.regular,
    borderBottomLeftRadius: theme.border.radius.regular,
  },
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
    textShadowOffset: {
      height: 1,
      width: 1,
    },
    textShadowRadius: 1,
  },
  toggleIcon: {
    marginLeft: theme.spacings.xSmall,
  },
}));
