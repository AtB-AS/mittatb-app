import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  geofencingZonesVectorSourceId,
  sourceLayerId,
  minZoomLevel,
} from '../components/mobility/GeofencingZonesAsTiles';
import {geofencingZoneCodes} from '../utils';
import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';

const universalGfzLayerProps = {
  slot: 'middle',
  source: geofencingZonesVectorSourceId,
  'source-layer': sourceLayerId,
  minzoom: minZoomLevel,
};
const code = ['coalesce', ['get', 'code'], 'allowed'];

/**
 * Ideally we should just use FillLayer and LineLayer in the component, but slots only seems to work through styleJSON.
 * By combining FillLayer and LineLayer components with existing true for these layers, the onPress on the VectorSource keeps working.
 * The layers are actually deleted by rnmapbox when gfz are closed, but toggling visibilty here, ensures that they are re-added.
 * Ensuring that the layers always exist with full style prevents some flickering.
 */
export const useGeofencingZonesLayers = (
  shouldShowGeofencingZonesLayers: boolean,
) => {
  const {isGeofencingZonesEnabled, isGeofencingZonesAsTilesEnabled} =
    useFeatureTogglesContext();

  const {theme} = useThemeContext();

  return useMemo(() => {
    const visibility =
      isGeofencingZonesEnabled &&
      isGeofencingZonesAsTilesEnabled &&
      shouldShowGeofencingZonesLayers
        ? 'visible'
        : 'none';
    return geofencingZoneCodes
      .map((geofencingZoneCode) => {
        const geofencingZoneStyle =
          theme.color.geofencingZone[geofencingZoneCode];
        const filterByGfzCode = ['==', code, geofencingZoneCode];
        return [
          {
            ...universalGfzLayerProps,
            id: `GeofencingZones_${geofencingZoneCode}_fill`,
            type: 'fill',
            paint: {
              'fill-color': geofencingZoneStyle.color.background,
              'fill-opacity': geofencingZoneStyle.fillOpacity,
              'fill-antialias': true,
              visibility,
            },
            filter: filterByGfzCode,
          },
          {
            ...universalGfzLayerProps,
            id: `GeofencingZones_${geofencingZoneCode}_line`,
            type: 'line',
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
              ...(geofencingZoneStyle.lineStyle === 'dashed'
                ? {'line-dasharray': [2, 2]}
                : {}),
            },
            paint: {
              'line-width': [
                'interpolate',
                ['exponential', 1.5],
                ['zoom'],
                12,
                2,
                18,
                4,
              ],
              'line-color': geofencingZoneStyle.color.background,
              'line-opacity': geofencingZoneStyle.strokeOpacity,
              'line-emissive-strength': 1,
              visibility,
            },
            filter: filterByGfzCode,
          },
        ];
      })
      .flatMap((layer) => layer);
  }, [
    shouldShowGeofencingZonesLayers,
    isGeofencingZonesAsTilesEnabled,
    isGeofencingZonesEnabled,
    theme.color.geofencingZone,
  ]);
};
