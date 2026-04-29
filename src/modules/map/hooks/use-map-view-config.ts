import {Platform} from 'react-native';
import {useMapboxJsonStyle} from './use-mapbox-json-style';
import {useMemo} from 'react';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

const COMPASS_BASE_TOP = 50;

const mapViewStaticConfig = {
  compassEnabled: true,
  scaleBarEnabled: false,
  attributionPosition: Platform.select({
    default: {bottom: 8, left: 95},
    android: {bottom: 5, left: 120},
  }),
};

type MapViewConfigOptions = {
  includeVehiclesAndStationsVectorSource?: boolean;
  includeBasemapStyle?: boolean;
  compassOffsetTop?: number;
};

export const useMapViewConfig = (
  mapViewConfigOptions?: MapViewConfigOptions,
) => {
  const {
    includeVehiclesAndStationsVectorSource = false,
    includeBasemapStyle = true,
    compassOffsetTop = 0,
  } = mapViewConfigOptions || {};
  const mapboxJsonStyle = useMapboxJsonStyle(
    includeVehiclesAndStationsVectorSource,
    includeBasemapStyle,
  );
  const configMap = useMemo(
    () => ({styleJSON: mapboxJsonStyle}),
    [mapboxJsonStyle],
  );
  const {enable_surface_view_map, map_max_pitch} = useRemoteConfigContext();

  // `mapbox` (v10) Adds compass offset `compassViewMargins` is still supported but generates issues:
  // Mapbox error fireEvent failed: <rnmapbox_maps.RCTMGLEvent: 0x6000028a0fe0>
  const compassPosition = useMemo(
    () => ({
      top: compassOffsetTop || COMPASS_BASE_TOP,
      right: Platform.select({default: 10, android: 6}),
    }),
    [compassOffsetTop],
  );

  return useMemo(
    () => ({
      ...mapViewStaticConfig,
      compassPosition,
      ...configMap,
      surfaceView: enable_surface_view_map,
      maxPitch: map_max_pitch,
    }),
    [compassPosition, configMap, enable_surface_view_map, map_max_pitch],
  );
};
