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

const scaleTransitionZoomRange = 1.5; // icon starts very small and then reaches full size across this zoom range
const opacityTransitionZoomRange = scaleTransitionZoomRange / 8;

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
  reachFullScaleAtZoomLevel: NsrLayer['reachFullScaleAtZoomLevel'];
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
  reachFullScaleAtZoomLevel,
  selectedFeaturePropertyId,
  iconImageProps,
  opacityTransitionZoomRangeDelay = 0.8,
  showTextWhileAFeatureIsSelected = false,
  iconFullSize = 1,
  textSizeFactor = 1,
}) => {
  const aFeatureIsSelected =
    !!selectedFeaturePropertyId && selectedFeaturePropertyId !== '';

  const iconImage = !iconImageProps
    ? ''
    : getExpressionForNsrIconImage(
        'default',
        iconImageProps,
        aFeatureIsSelected,
      );

  // mapbox breaks unless iconImage is either a string literal directly, or in a zoom step or interpolate function,
  // so here it is wrapped with a step function that always returns the same
  const iconImageWrapped: Expression = [
    'step',
    ['zoom'],
    iconImage,
    reachFullScaleAtZoomLevel,
    iconImage,
  ];

  // Icons and labels start small and invisible, then grow and become more visible and prominent as you zoom in.
  return {
    minZoomLevel: reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    style: {
      iconImage: iconImageWrapped,
      iconSize: [
        'interpolate',
        ['linear'],
        ['zoom'],
        reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
        0.3,
        reachFullScaleAtZoomLevel,
        iconFullSize,
      ],
      iconOpacity: [
        'interpolate',
        ['linear'],
        ['zoom'],
        reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
        0,
        reachFullScaleAtZoomLevel -
          scaleTransitionZoomRange +
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
                reachFullScaleAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ) - opacityTransitionZoomRange,
              0,
              Math.max(
                reachFullScaleAtZoomLevel + opacityTransitionZoomRangeDelay,
                13.75,
              ),
              1,
            ],
    },
  };
};
