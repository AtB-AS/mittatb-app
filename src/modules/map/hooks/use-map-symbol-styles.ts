import {useThemeContext} from '@atb/theme';

import {nsrSymbolLayers} from '../components/national-stop-registry-features/nsr-layers';
import {
  Expression,
  SymbolLayerStyleProps,
  FilterExpression,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
type ExpressionField = Expression[1];
import {PinType} from '../mapbox-styles/pin-types';
import {SelectedMapItemProperties} from '../types';
import {getIconZoomTransitionStyle} from '../utils';
import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';

export const scaleTransitionZoomRange = 0.3;
const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 4;
export const smallestAllowedSizeFactor = 0.3;

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
  const nothingIsSelected: Expression = ['==', selectedFeatureId, ''];
  const isSelected: Expression = ['==', featureId, selectedFeatureId];
  const isMinimized: Expression = [
    'all',
    ['!', isSelected],
    ['!', nothingIsSelected],
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
    isSelected,
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

  const countAdjustmentMaxFactorIncrease = 0.2;
  const countAdjustedSizeFactor = [
    'step',
    numberOfUnits,
    ['+', 1, ['*', numberOfUnits, countAdjustmentMaxFactorIncrease / 100]],
    100,
    1 + countAdjustmentMaxFactorIncrease,
  ];

  const iconFullSize: Expression = [
    '*',
    ['case', reduceIconSize, 0.855, 1],
    countAdjustedSizeFactor,
  ];

  const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
    reachFullScaleAtZoomLevel,
    iconFullSize,
    scaleTransitionZoomRange,
    opacityTransitionExtraZoomRange,
  );

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
  const vehicle_type_propulsion_type: Expression = [
    'get',
    'vehicle_type_propulsion_type',
  ];
  const isElectric: Expression = [
    'in',
    vehicle_type_propulsion_type,
    ['literal', [PropulsionType.Electric, PropulsionType.ElectricAssist]],
  ];

  const iconCode: Expression = [
    'case',
    ...stopPlacesExpression,
    ['==', vehicle_type_form_factor, 'SCOOTER'],
    'scooter',
    ['==', vehicle_type_form_factor, 'SCOOTER_STANDING'],
    'scooter',
    ['==', vehicle_type_form_factor, 'BICYCLE'],
    ['case', isElectric, 'ebike', 'citybike'],
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
      ? [
          'case',
          [
            'any',
            ['==', iconCode, 'scooter'],
            ['all', ['==', iconCode, 'ebike'], ['!', isCluster]],
          ],
          transportOperator,
          '',
        ]
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
            ['==', iconCode, 'ebike'],
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

  const symbolSortKey: Expression = [
    '+',
    [
      'case',
      ['==', iconCode, 'ebike'],
      2000, // Bikes get priority
      ['==', iconCode, 'scooter'],
      1000, // Scooters stay below
      0, // Default
    ],
    ['case', isCluster, 3000, 0], // Clusters get priority

    // Also give priority to clusters/stations with higher count.
    // Location data is not accessible in style expressions, so uniqueness requires an id. Using numberOfUnits resolves this for all cases apart from when numberOfUnits is the same.
    ['coalesce', numberOfUnits, 0],
  ];

  const iconStyle: SymbolLayerStyleProps = {
    iconImage,
    iconOffset: [0, 0],
    iconAllowOverlap: true,
    iconOpacity,
    iconSize,
    symbolSortKey,
    iconEmissiveStrength: 1,
  };

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
    [0.44, 0],
    [
      'step',
      numberOfUnits,
      [0.82 * textOffsetXFactor, 0],
      100,
      [1.0 * textOffsetXFactor, 0],
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
    textOpacity: iconOpacity, // Text opacity should follow same rules as icon opacity
    textColor: isDarkMode ? '#ffffff' : '#000000',
    textSize,
    textOffset,
    textFont: ['Open Sans Bold'],
    textAnchor: 'center',
    textAllowOverlap: true,
  };
  return {
    isSelected,
    iconStyle,
    textStyle,
  };
};

/**
 * Add this filter to hide far away items.
 * The higher pitch, the less distance away makes sense to show.
 * Otherwise the whole horizon may be filled with items.
 */
export const hideItemsInTheDistanceFilter: FilterExpression = [
  'case',
  ['<=', ['pitch'], 40],
  true,
  [
    '<=',
    ['distance-from-center'],
    [
      'min',
      ['interpolate', ['linear'], ['pitch'], 50, 1, 85, 0.75],
      ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 0.75],
    ],
  ],
];
