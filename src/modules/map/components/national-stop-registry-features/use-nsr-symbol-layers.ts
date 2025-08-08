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
import {useMemo} from 'react';
import {pitchBasedDistanceFilter} from '../../hooks/use-map-symbol-styles';

export const useNsrSymbolLayers = (
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'],
): SymbolLayerProps[] => {
  const {theme, themeName} = useThemeContext();

  return useMemo(
    () =>
      nsrSymbolLayers.map((nsrSymbolLayer) => {
        const {
          id,
          iconCode,
          textLocation,
          textField,
          reachFullScaleAtZoomLevel,
        } = nsrSymbolLayer;
        const nsrSymbolLayerSourceProps = getNsrLayerSourceProps(id);

        const filter = getFilterWhichAlsoHidesSelectedFeature(
          [...nsrSymbolLayer.filter, pitchBasedDistanceFilter], // also hide features too far away when the camera is pitched
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
            reachFullScaleAtZoomLevel,
            selectedFeaturePropertyId,
            opacityTransitionZoomRangeDelay: 0,
            showTextWhileAFeatureIsSelected: true,
            textSizeFactor: 0.65,
          };

        if (textLocation === NsrSymbolLayerTextLocation.BelowIcon) {
          textColor = theme.color.foreground.dynamic.primary;
          textHaloColor = theme.color.foreground.inverse.primary;

          textHaloWidth = 2;
          textVariableAnchor = ['top'];

          layerPropsDeterminedByZoomLevelParams = {
            reachFullScaleAtZoomLevel,
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

        const iconStyleProps: SymbolLayerStyleProps = !nsrSymbolLayer?.iconCode
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

        const textStyleProps: SymbolLayerStyleProps = !nsrSymbolLayer?.textField
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
            ...iconStyleProps,
            ...textStyleProps,
          },
        };
      }),
    [
      selectedFeaturePropertyId,
      theme.color.foreground.dynamic.primary,
      theme.color.foreground.inverse.primary,
      theme.color.transport.city.primary.foreground.primary,
      theme.color.transport.city.primary.foreground.secondary,
      themeName,
    ],
  );
};
