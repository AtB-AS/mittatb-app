import {MapCameraConfig, useMapViewConfig} from '@atb/modules/map';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import MapboxGL from '@rnmapbox/maps';
import {Position} from 'geojson';
import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, View} from 'react-native';
import {MapLabel} from './MapLabel';
import {MapRoute} from './MapRoute';
import {createMapLines, getMapBounds, pointOf} from '../utils';
import {Coordinates} from '@atb/utils/coordinates';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {NativeTouchable} from '@atb/components/native-touchable';
import {ServiceJourneyPolyline} from '@atb/api/types/serviceJourney';
import {shadows} from '@atb/modules/map';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';

export type MapProps = {
  serviceJourneyPolylines: ServiceJourneyPolyline[];
  fromPlace?: Coordinates | Position;
  toPlace?: Coordinates | Position;
  buttonText: string;
  isLive?: boolean;
  onExpand?(): void;
};

export const CompactTravelDetailsMap: React.FC<MapProps> = ({
  serviceJourneyPolylines,
  fromPlace,
  toPlace,
  buttonText,
  isLive = false,
  onExpand,
}) => {
  const {t} = useTranslation();
  const {themeName} = useThemeContext();
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const features = useMemo(
    () => createMapLines(serviceJourneyPolylines),
    [serviceJourneyPolylines],
  );
  const bounds = useMemo(() => getMapBounds(features), [features]);

  const mapViewConfig = useMapViewConfig();

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

  return (
    <View>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          style={styles.map}
          scrollEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          {...mapViewConfig}
          compassEnabled={false}
          onPress={onExpand}
        >
          <MapboxGL.Camera
            {...MapCameraConfig}
            defaultSettings={{bounds}}
            ref={cameraRef}
          />
          <MapRoute lines={features} />
          {toPlace && (
            <MapLabel
              point={pointOf(toPlace)}
              id="end"
              text={t(MapTexts.endPoint.label)}
            />
          )}
          {fromPlace && (
            <MapLabel
              point={pointOf(fromPlace)}
              id="start"
              text={t(MapTexts.startPoint.label)}
            />
          )}
        </MapboxGL.MapView>
        <View style={styles.pillOverlay} pointerEvents="box-none">
          <NativeTouchable
            variant="block"
            style={styles.pill}
            onPress={onExpand}
            accessibilityRole="button"
          >
            {isLive && (
              <ThemeIcon
                svg={themeName === 'dark' ? RealtimeDark : RealtimeLight}
                size="small"
              />
            )}
            <ThemeText typography="body__s__strong" type="primary">
              {buttonText}
            </ThemeText>
            <ThemeIcon svg={ChevronRight} />
          </NativeTouchable>
        </View>
      </View>
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  mapContainer: {
    height: 120,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  pillOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.medium,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
    paddingVertical: theme.spacing.xSmall,
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.circle,
    ...shadows,
  },
  map: {
    width: '100%',
    height: '100%',
  },
}));
