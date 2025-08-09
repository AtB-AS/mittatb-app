import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Camera, MapState, MapView} from '@rnmapbox/maps';
import {Dimensions} from 'react-native';
import {useMapViewConfig} from '../hooks/use-map-view-config';
import {ForwardedRef, forwardRef, useRef} from 'react';
import {DEFAULT_ZOOM_LEVEL} from '../MapV2';
import {MapCameraConfig} from '../MapConfig';
import {Coordinates} from '@atb/utils/coordinates';
import {useInterval} from '@atb/utils/use-interval';
import {Position} from 'geojson';
import distance from '@turf/distance';

type VectorSourceTilePreloaderProps = {
  startingCoordinates?: Coordinates;
  /**
   * For tile preloading to work, make sure to include
   * - relevant VectorSources
   * - SymbolLayers using the VectorSources
   * For performance, also filter out the icons to not actually draw them.
   */
  children?: React.ReactNode;
};

/**
 * The purpose of this component is to preload vector tiles.
 * This helps prevent flickering and missed in-transitions when zooming in.
 * Unfortunately rnmapbox does not have native functionality/props for this.
 *
 * Achieved with a parallell map not shown on the screen,
 * which zooms to the next zoom level in order to preload that area with that zoom level.
 * For the sake of performance, no symbols should be drawn on this map.
 *
 * Currently
 * - only preloads based on zoom, but can in theory be used to preload e.g. flying/driving paths too.
 * - pitch and padding ignored for viewport.
 */
export const VectorSourceTilePreloader = forwardRef<
  MapState,
  VectorSourceTilePreloaderProps
>(
  (
    {startingCoordinates, children}: VectorSourceTilePreloaderProps,
    /** Should be set like this: onCameraChanged={(state) => {mapStateRef.current = state;}} */
    mapStateRef: ForwardedRef<MapState>,
  ) => {
    const mapCameraOffscreenRef = useRef<Camera>(null);

    const mapViewConfig = useMapViewConfig({
      shouldShowVehiclesAndStations: true,
    });

    const previousZoomRef = useRef<number>(0);
    const previousCenterRef = useRef<Position>([0, 0]);
    const previousUpdateTimeRef = useRef<number>(new Date().getTime());
    useInterval(
      () => {
        if (mapStateRef && 'current' in mapStateRef && mapStateRef.current) {
          const {zoom, center} = mapStateRef.current.properties;

          const metersMoved = distance(center, previousCenterRef.current, {
            units: 'meters',
          });

          const now = new Date().getTime();
          const secondsSinceLastUpdate =
            (now - previousUpdateTimeRef.current) / 1000;

          if (
            zoom !== previousZoomRef.current ||
            metersMoved > 75 || // ignore small movements (may also want to adjust this threshold based on zoom)
            secondsSinceLastUpdate > 5
          ) {
            const isZoomingOut = zoom < previousZoomRef.current;

            mapCameraOffscreenRef.current?.setCamera({
              centerCoordinate: center,
              zoomLevel: zoom + (isZoomingOut ? -1 : 1), // preloading the next zoom level when zooming in or moving around
              animationMode: 'none',
              animationDuration: 0,
            });

            previousZoomRef.current = zoom;
            previousCenterRef.current = center;
            previousUpdateTimeRef.current = now;
          }
        }
      },
      [mapStateRef],
      100, // Refresh rate. Might be lower for slow devices. No need for very short interval, this is "just for preloading behind the scenes".
    );

    const tabBarHeight = useBottomTabBarHeight();
    const {width, height} = Dimensions.get('window');
    return (
      <MapView
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: -(height - tabBarHeight) - 100,
          left: -width - 100,
          height: height - tabBarHeight,
          width: width,
          opacity: 0,
          // useful for development/inspection:
          // top: 0,
          // bottom: 0,
          // height: (height - tabBarHeight) / 2,
          // width: width / 2,
          // opacity: 1,
          // borderWidth: 1,
        }}
        pitchEnabled={false}
        {...mapViewConfig}
        attributionEnabled={false}
        compassEnabled={false}
        logoEnabled={false}
      >
        <Camera
          ref={mapCameraOffscreenRef}
          zoomLevel={DEFAULT_ZOOM_LEVEL}
          centerCoordinate={
            startingCoordinates
              ? [startingCoordinates.longitude, startingCoordinates.latitude]
              : [0, 0]
          }
          {...MapCameraConfig}
        />
        {children}
      </MapView>
    );
  },
);
