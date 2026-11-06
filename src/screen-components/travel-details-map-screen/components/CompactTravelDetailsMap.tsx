import {MapCameraConfig, useMapViewConfig} from '@atb/modules/map';
import {StyleSheet, useThemeContext} from '@atb/theme';
import MapboxGL from '@rnmapbox/maps';
import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, View} from 'react-native';
import {MapRoute} from './MapRoute';
import {createMapLines, getMapBounds} from '../utils';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ServiceJourneyPolyline} from '@atb/api/types/serviceJourney';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';

export type MapProps = {
  serviceJourneyPolylines: ServiceJourneyPolyline[];
  buttonText: string;
  isLive?: boolean;
  isLoading?: boolean;
  onExpand?(): void;
};

export const CompactTravelDetailsMap: React.FC<MapProps> = ({
  serviceJourneyPolylines,
  buttonText,
  isLive = false,
  isLoading = false,
  onExpand,
}) => {
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
          onPress={isLoading ? undefined : onExpand}
        >
          <MapboxGL.Camera
            {...MapCameraConfig}
            defaultSettings={{bounds}}
            ref={cameraRef}
          />
          <MapRoute lines={features} />
        </MapboxGL.MapView>
        <View style={styles.pillOverlay} pointerEvents="box-none">
          <Button
            expanded={false}
            surfaceColor="neutral"
            text={buttonText}
            leftIcon={
              isLive
                ? {svg: themeName === 'dark' ? RealtimeDark : RealtimeLight}
                : undefined
            }
            rightIcon={{svg: ChevronRight}}
            loading={isLoading}
            hasShadow
            style={styles.button}
            onPress={() => onExpand?.()}
          />
        </View>
      </View>
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  mapContainer: {
    height: 100,
    borderRadius: theme.border.radius.regular,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.surface.neutral.subtle.background,
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
  button: {
    alignSelf: 'flex-end',
  },
  map: {
    width: '100%',
    height: '100%',
  },
}));
