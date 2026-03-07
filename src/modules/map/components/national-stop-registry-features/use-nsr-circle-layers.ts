import {useThemeContext} from '@atb/theme';
import {NsrProps} from './NationalStopRegistryFeatures';
import {nsrCircleLayers} from './nsr-layers';
import {
  getFilterWhichAlsoHidesSelectedFeature,
  getLayerPropsDeterminedByZoomLevel,
  getNsrLayerSourceProps,
} from './nsr-utils';
import {Props as SymbolLayerProps} from 'node_modules/@rnmapbox/maps/src/components/SymbolLayer';
import {CircleLayerStyleProps} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {useMemo} from 'react';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

export const useNsrCircleLayers = (
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'],
): SymbolLayerProps[] => {
  const {theme, themeName} = useThemeContext();
  const {mapbox_nsr_source_layer_id} = useRemoteConfigContext();

  return useMemo(
    () =>
      nsrCircleLayers.map((nsrCircleLayer) => {
        const {id, reachFullScaleAtZoomLevel} = nsrCircleLayer;
        const nsrLayerSourceProps = getNsrLayerSourceProps(
          mapbox_nsr_source_layer_id,
          id,
        );

        const filter = getFilterWhichAlsoHidesSelectedFeature(
          nsrCircleLayer.filter,
          selectedFeaturePropertyId,
        );

        const {minZoomLevel, style} = getLayerPropsDeterminedByZoomLevel({
          reachFullScaleAtZoomLevel,
          selectedFeaturePropertyId,
          iconFullSize: 11,
        });

        const {iconSize: circleRadius, iconOpacity: circleOpacity} = style;

        const circleLayerStyle: CircleLayerStyleProps = {
          circleRadius,
          circleOpacity,

          circleColor: theme.color.transport.city.primary.background,
          circleStrokeColor: themeName === 'light' ? '#ffffff' : '#000000',
          circleStrokeWidth: 1.1,
          circleTranslate: [0, 0] as const,
        };

        const circleLayerProps: SymbolLayerProps = {
          ...nsrLayerSourceProps,
          id: id ?? '',
          filter,
          minZoomLevel,
          style: circleLayerStyle,
        };

        return circleLayerProps;
      }),
    [
      mapbox_nsr_source_layer_id,
      selectedFeaturePropertyId,
      theme.color.transport.city.primary.background,
      themeName,
    ],
  );
};
