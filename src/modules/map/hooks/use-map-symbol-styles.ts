import {useThemeContext} from '@atb/theme';

import {nsrSymbolLayers} from '../components/national-stop-registry-features/nsr-layers';
import {
  ExpressionField,
  Expression,
  SymbolLayerStyleProps,
} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {PinType} from '../mapbox-styles/pin-types';
import {SelectedMapItemProperties} from '../types';

export const scaleTransitionZoomRange = 0.4;
const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 8;
const smallestAllowedSizeFactor = 0.3;

type MapSymbolStylesProps = {
  selectedFeaturePropertyId: SelectedMapItemProperties['id'];
  pinType: PinType;
  reachFullScaleAtZoomLevel: number;
  textSizeFactor?: number;
};
// Returns Mapbox Style Expressions to determine map symbol styles.
export const useMapSymbolStyles = ({
  selectedFeaturePropertyId,
  pinType,
  reachFullScaleAtZoomLevel,
  textSizeFactor = 1.0,
}: MapSymbolStylesProps) => {
  const {themeName} = useThemeContext();
  const isDarkMode = themeName === 'dark';

  const featureId: Expression = ['get', 'id'];
  const selectedFeatureId = selectedFeaturePropertyId || ''; // because mapbox style expressions don't like undefined
  const thisFeatureIsSelected: Expression = [
    '==',
    featureId,
    selectedFeatureId,
  ];
  const noFeatureIsSelected: Expression = ['==', selectedFeatureId, ''];
  const isMinimized: Expression = [
    'all',
    ['!', thisFeatureIsSelected],
    ['!', noFeatureIsSelected],
  ];

  const countPropName = 'count';
  const count: Expression = ['get', countPropName];
  const numVehiclesAvailable: Expression = ['get', 'num_vehicles_available'];

  const isCluster: Expression = [
    'all',
    ['has', countPropName],
    ['!=', count, 1],
  ];

  const mapItemIconNonClusterState: Expression = [
    'case',
    thisFeatureIsSelected,
    'selected',
    ['case', isMinimized, 'minimized', 'default'],
  ];
  const mapItemIconState: Expression = [
    'case',
    isCluster,
    ['case', isMinimized, 'cluster_minimized', 'cluster'],
    mapItemIconNonClusterState,
  ];

  const reduceIconSize: Expression = [
    'all',
    ['any', pinType === 'station', isCluster],
    ['!', isMinimized],
  ];

  const iconFullSize: Expression = ['case', reduceIconSize, 0.855, 1];

  const iconSize: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    smallestAllowedSizeFactor,
    reachFullScaleAtZoomLevel,
    iconFullSize,
  ];

  const stopPlacesExpression: (Expression | ExpressionField)[] = nsrSymbolLayers
    .filter(
      (nsrSymbolLayer) =>
        nsrSymbolLayer.filter !== undefined &&
        nsrSymbolLayer.iconCode !== undefined,
    )
    .flatMap((nsrSymbolLayer) => [
      nsrSymbolLayer.filter,
      nsrSymbolLayer.iconCode as ExpressionField,
    ]);

  const vehicle_type_form_factor: Expression = [
    'get',
    'vehicle_type_form_factor',
  ];
  const iconCode: Expression = [
    'case',
    ...stopPlacesExpression,
    ['==', vehicle_type_form_factor, 'SCOOTER'],
    'scooter',
    ['==', vehicle_type_form_factor, 'SCOOTER_STANDING'],
    'scooter',
    ['==', vehicle_type_form_factor, 'BICYCLE'],
    'citybike',
    ['==', vehicle_type_form_factor, 'CAR'],
    'sharedcar',
    'non-existing-icon',
  ];

  const systemId: Expression = ['get', 'system_id'];
  const transportOperator: Expression = [
    'case',
    ['!', ['has', 'system_id']],
    'generic',
    [
      'case',
      ['==', ['slice', systemId, 0, 4], 'ryde'],
      'ryde',
      ['==', ['slice', systemId, 0, 3], 'voi'],
      'voi',
      ['==', ['slice', systemId, 0, 4], 'dott'],
      'dott',
      'generic',
    ],
  ];

  const suffix: Expression =
    pinType === 'vehicle'
      ? ['case', ['==', iconCode, 'scooter'], transportOperator, '']
      : mapItemIconNonClusterState;

  // should make this easier to understand, perhaps rename images to achieve it
  const iconImage: Expression = [
    'concat',
    pinType,
    'pin_',
    iconCode,
    pinType === 'stop' ? '' : '_',
    pinType === 'stop'
      ? ''
      : pinType !== 'station'
      ? mapItemIconState
      : [
          'case',
          ['==', iconCode, 'citybike'],
          'bikes',
          ['==', iconCode, 'sharedcar'],
          'cars',
          'bikes',
        ],
    ['case', ['==', suffix, ''], '', '_'],
    suffix,
    '_',
    themeName,
  ];

  const fadeInOpacity: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    0,
    reachFullScaleAtZoomLevel -
      scaleTransitionZoomRange +
      opacityTransitionExtraZoomRange,
    1,
  ];

  const iconStyle: SymbolLayerStyleProps = {
    iconImage,
    iconSize,
    iconOpacity: fadeInOpacity,
    iconOffset: [0, 0],
    iconAllowOverlap: true,
  };

  const textOffsetXFactor = pinType == 'vehicle' ? 1 : 1.045;
  const numberOfUnits = pinType == 'vehicle' ? count : numVehiclesAvailable;
  const numberOfUnitsLimitedAt99Plus: Expression = [
    'case',
    isMinimized,
    '+',
    ['>', numberOfUnits, 99],
    '99+',
    numberOfUnits,
  ];

  const textField: Expression =
    pinType == 'station'
      ? [
          'case',
          ['!=', mapItemIconNonClusterState, 'minimized'],
          numberOfUnitsLimitedAt99Plus,
          '',
        ]
      : ['case', isCluster, numberOfUnitsLimitedAt99Plus, ''];

  const textOffset: Expression = [
    'case',
    isMinimized,
    [0.44, -0.175],
    [
      'step',
      numberOfUnits,
      [0.82 * textOffsetXFactor, -0.15],
      100,
      [1.0 * textOffsetXFactor, -0.15],
    ],
  ];

  const getCountAdjustedTextSize: (baseSize: number) => Expression = (
    baseSize,
  ) => [
    'case',
    isMinimized,
    baseSize * textSizeFactor * 12.6,
    [
      'step',
      numberOfUnits,
      baseSize * textSizeFactor * 12.6,
      100,
      baseSize * textSizeFactor * 10.8,
    ],
  ];

  const textSize: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    getCountAdjustedTextSize(1 * smallestAllowedSizeFactor),
    reachFullScaleAtZoomLevel,
    getCountAdjustedTextSize(1),
  ];

  const textStyle: SymbolLayerStyleProps = {
    textField,
    textOpacity: fadeInOpacity,
    textColor: isDarkMode ? '#ffffff' : '#000000',
    textSize,
    textOffset,
    textFont: ['Open Sans Bold'],
    textAnchor: 'center',
    textAllowOverlap: true,
  };
  return {
    isSelected: thisFeatureIsSelected,
    iconStyle,
    textStyle,
  };
};
