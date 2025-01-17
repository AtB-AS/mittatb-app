import {useThemeContext} from '@atb/theme';
import {NsrProps} from './NationalStopRegistryFeatures';
import {nsrCircleLayers} from './nsr-layers';
import {
  getFilterWhichAlsoHidesSelectedFeature,
  getLayerPropsDeterminedByZoomLevel,
  getNsrLayerSourceProps,
} from './nsr-utils';
import {Props as SymbolLayerProps} from '@rnmapbox/maps/lib/typescript/src/components/SymbolLayer';

const circleFullSizeRadius = 11;

export const useNsrCircleLayers = (
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'],
): SymbolLayerProps[] => {
  const {theme, themeName} = useThemeContext();

  return nsrCircleLayers.map((nsrCircleLayer) => {
    const {id, showAsDefaultAtZoomLevel} = nsrCircleLayer;
    const nsrLayerSourceProps = getNsrLayerSourceProps(id);

    const filter = getFilterWhichAlsoHidesSelectedFeature(
      nsrCircleLayer.filter,
      selectedFeaturePropertyId,
    );

    const {minZoomLevel, style} = getLayerPropsDeterminedByZoomLevel({
      showAsDefaultAtZoomLevel,
      selectedFeaturePropertyId,
      iconFullSize: circleFullSizeRadius,
    });

    const {iconSize: circleRadius, iconOpacity: circleOpacity} = style;

    return {
      ...nsrLayerSourceProps,
      id,
      filter,
      minZoomLevel,
      style: {
        circleRadius,
        circleOpacity,

        circleColor: theme.color.transport.city.primary.background,
        circleStrokeColor: themeName === 'light' ? '#ffffff' : '#000000',
        circleStrokeWidth: 1.1,
        circleTranslate: [0, 0],
      },
    };
  });
};
