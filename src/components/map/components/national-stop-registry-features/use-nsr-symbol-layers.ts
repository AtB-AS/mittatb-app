import {useThemeContext} from '@atb/theme';
import {nsrSymbolLayers, NsrSymbolLayerTextLocation} from './nsr-layers';
import {
  getFilterWhichAlsoHidesSelectedFeature,
  getLayerPropsDeterminedByZoomLevel,
  getNsrLayerSourceProps,
  LayerPropsDeterminedByZoomLevelParams,
} from './nsr-utils';
import {NsrProps} from './NationalStopRegistryFeatures';
import {SymbolLayerStyleProps} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {Props as SymbolLayerProps} from '@rnmapbox/maps/lib/typescript/src/components/SymbolLayer';

export const useNsrSymbolLayers = (
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'],
): SymbolLayerProps[] => {
  const {theme, themeName} = useThemeContext();

  return nsrSymbolLayers.map((nsrSymbolLayer) => {
    const {id, iconCode, textLocation, textField, showAsDefaultAtZoomLevel} =
      nsrSymbolLayer;
    const nsrSymbolLayerSourceProps = getNsrLayerSourceProps(id);

    const filter = getFilterWhichAlsoHidesSelectedFeature(
      nsrSymbolLayer.filter,
      selectedFeaturePropertyId,
    );

    // inital values are set for the case when textLocation === NsrSymbolLayerTextLocation.InsideCircle
    let textColor: SymbolLayerStyleProps['textColor'] =
      theme.color.transport.city.primary.foreground.primary;
    let textHaloColor: SymbolLayerStyleProps['textHaloColor'] =
      theme.color.transport.city.primary.foreground.secondary;
    let textHaloWidth: SymbolLayerStyleProps['textHaloWidth'] = 0.3;
    let textVariableAnchor: SymbolLayerStyleProps['textVariableAnchor'] = [
      'center',
    ];

    let layerPropsDeterminedByZoomLevelParams: LayerPropsDeterminedByZoomLevelParams =
      {
        showAsDefaultAtZoomLevel,
        selectedFeaturePropertyId,
        opacityTransitionZoomRangeDelay: 0,
        showTextWhileAFeatureIsSelected: true,
        textSizeFactor: 0.65,
      };

    if (textLocation === NsrSymbolLayerTextLocation.BelowIcon) {
      textColor =
        themeName === 'light' ? 'hsl(236, 56%, 22%)' : 'hsl(0, 0%, 100%)';
      textHaloColor =
        themeName === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(236, 56%, 22%)';
      textHaloWidth = 2;
      textVariableAnchor = ['top'];

      layerPropsDeterminedByZoomLevelParams = {
        showAsDefaultAtZoomLevel,
        selectedFeaturePropertyId,
        iconImageProps: {
          iconCode,
          themeName,
        },
      };
    }

    const {minZoomLevel, style} = getLayerPropsDeterminedByZoomLevel(
      layerPropsDeterminedByZoomLevelParams,
    );
    const {iconImage, iconSize, iconOpacity, textSize, textOpacity} = style;

    const iconProps: SymbolLayerStyleProps = !nsrSymbolLayer?.iconCode
      ? {}
      : {
          iconImage,
          iconSize,
          iconOpacity,
          iconIgnorePlacement: true,
          iconAllowOverlap: true,
          iconPadding: 0,
          iconOffset: [0, 0],
        };

    const textProps: SymbolLayerStyleProps = !nsrSymbolLayer?.textField
      ? {}
      : {
          textSize,
          textOpacity,
          textField,
          textColor,
          textHaloColor,
          textVariableAnchor,
          textAnchor: 'top',
          textFont: ['DIN Offc Pro Regular', 'Arial Unicode MS Regular'],
          textRadialOffset: 1.2,
          textAllowOverlap: true,
          textMaxWidth: 7,
          textLineHeight: 0.9,
          textIgnorePlacement: true,
          textTranslate: [0, 0],
          textHaloWidth,
        };

    return {
      ...nsrSymbolLayerSourceProps,
      id,
      filter,
      minZoomLevel,
      style: {
        ...iconProps,
        ...textProps,
      },
    };
  });
};
