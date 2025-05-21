import {MAPBOX_NSR_SOURCE_LAYER_ID} from '@env';
import {NsrProps} from './NationalStopRegistryFeatures';
import {NsrLayer} from './nsr-layers';
import {
  Expression,
  FilterExpression,
} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {Props as LayerPropsCommonAndStyle} from '@rnmapbox/maps/lib/typescript/src/components/SymbolLayer';
import {SymbolLayerStyleProps} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {NsrPinIconCode, PinTheme, PinType} from '../../mapbox-styles/pin-types';

export const getNsrLayerSourceProps = (
  layerId: string,
): Required<
  Pick<LayerPropsCommonAndStyle, 'sourceID' | 'sourceLayerID' | 'id'>
> => ({
  sourceID: 'composite',
  sourceLayerID: MAPBOX_NSR_SOURCE_LAYER_ID,
  id: layerId,
});

export const getFilterWhichAlsoHidesSelectedFeature = (
  /**
   * @property {FilterExpression} filter should be an array with 'all' as the first element
   */
  filter: FilterExpression,
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'],
): FilterExpression => [
  ...filter,
  ['!=', ['get', 'id'], selectedFeaturePropertyId ?? ''],
];

const minimizedZoomRange = 3.5; // show icon as minimized version for this number of zoom levels before switching to default
const opacityTransitionZoomRange = minimizedZoomRange / 4;

type IconImageProps = {
  iconCode: NsrPinIconCode;
  themeName: PinTheme;
};

const nsrPinType: PinType = 'stop'; // pinType = 'stop' for all NSR items

const getExpressionForNsrIconImage = (
  iconType: 'default' | 'minimized',
  iconImageProps: IconImageProps,
  aFeatureIsSelected: boolean,
): Expression => [
  'concat',
  nsrPinType,
  'pin_',
  iconImageProps.iconCode,
  '_',
  ['case', aFeatureIsSelected, 'minimized', iconType],
  '_',
  iconImageProps.themeName,
];

export type LayerPropsDeterminedByZoomLevelParams = {
  showAsDefaultAtZoomLevel: NsrLayer['showAsDefaultAtZoomLevel'];
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'];
  iconImageProps?: IconImageProps;
  opacityTransitionZoomRangeDelay?: number;
  showTextWhileAFeatureIsSelected?: boolean;
  iconFullSize?: number;
  textSizeFactor?: number;
};

type LayerPropsDeterminedByZoomLevel = {
  minZoomLevel: LayerPropsCommonAndStyle['minZoomLevel'];
  style: Required<
    Pick<
      SymbolLayerStyleProps,
      'iconImage' | 'iconSize' | 'iconOpacity' | 'textSize' | 'textOpacity'
    >
  >;
};

export const getLayerPropsDeterminedByZoomLevel: (
  layerPropsDeterminedByZoomLevelProps: LayerPropsDeterminedByZoomLevelParams,
) => LayerPropsDeterminedByZoomLevel = ({
  showAsDefaultAtZoomLevel,
  selectedFeaturePropertyId,
  iconImageProps,
  opacityTransitionZoomRangeDelay = 0.7,
  showTextWhileAFeatureIsSelected = false,
  iconFullSize = 1,
  textSizeFactor = 1,
}) => {
  const aFeatureIsSelected =
    !!selectedFeaturePropertyId && selectedFeaturePropertyId !== '';

  // Icons and labels start small and invisible, then grow and become more visible and prominent as you zoom in.
  return {
    minZoomLevel: showAsDefaultAtZoomLevel - minimizedZoomRange,
    style: {
      iconImage: !iconImageProps
        ? ''
        : [
            'step',
            ['zoom'],
            getExpressionForNsrIconImage(
              'minimized',
              iconImageProps,
              aFeatureIsSelected,
            ),
            showAsDefaultAtZoomLevel,
            getExpressionForNsrIconImage(
              'default',
              iconImageProps,
              aFeatureIsSelected,
            ),
          ],
      iconSize: [
        'interpolate',
        ['linear'],
        ['zoom'],
        showAsDefaultAtZoomLevel - minimizedZoomRange,
        0,
        showAsDefaultAtZoomLevel,
        iconFullSize,
      ],
      iconOpacity: [
        'interpolate',
        ['linear'],
        ['zoom'],
        showAsDefaultAtZoomLevel - minimizedZoomRange,
        0,
        showAsDefaultAtZoomLevel -
          minimizedZoomRange +
          opacityTransitionZoomRange,
        1,
      ],
      textSize: [
        'interpolate',
        ['exponential', 1.5],
        ['zoom'],
        14,
        textSizeFactor * 13,
        22,
        textSizeFactor * 27,
      ],
      textOpacity:
        aFeatureIsSelected && !showTextWhileAFeatureIsSelected
          ? 0
          : [
              'interpolate',
              ['linear'],
              ['zoom'],
              Math.max(
                showAsDefaultAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ) - opacityTransitionZoomRange,
              0,
              Math.max(
                showAsDefaultAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ),
              1,
            ],
    },
  };
};
