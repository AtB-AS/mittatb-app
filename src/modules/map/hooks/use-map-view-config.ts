import {Platform} from 'react-native';
import {useMapboxJsonStyle} from './use-mapbox-json-style';
import {useMemo} from 'react';

const MapViewStaticConfig = {
  compassEnabled: true,
  scaleBarEnabled: false,
  // `mapbox` (v10) Adds compass offset `compassViewMargins` is still supported but generates issues:
  // Mapbox error fireEvent failed: <rnmapbox_maps.RCTMGLEvent: 0x6000028a0fe0>
  compassPosition: {
    top: 60,
    right: Platform.select({default: 10, android: 6}),
  },
  attributionPosition: Platform.select({
    default: {bottom: 8, left: 95},
    android: {bottom: 5, left: 120},
  }),
};

type MapViewConfigOptions = {
  shouldShowVehiclesAndStations?: boolean;
};

export const useMapViewConfig = (
  mapViewConfigOptions?: MapViewConfigOptions,
) => {
  const {shouldShowVehiclesAndStations = false} = mapViewConfigOptions || {};
  const mapboxJsonStyle = useMapboxJsonStyle(shouldShowVehiclesAndStations);
  const configMap = useMemo(
    () => ({styleJSON: mapboxJsonStyle}),
    [mapboxJsonStyle],
  );

  return useMemo(
    () => ({
      ...MapViewStaticConfig,
      ...configMap,
    }),
    [configMap],
  );
};
