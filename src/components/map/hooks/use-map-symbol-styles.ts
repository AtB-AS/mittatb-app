import {useThemeContext} from '@atb/theme';

import {nsrSymbolLayers} from '../components/national-stop-registry-features/nsr-layers';
import {
  ExpressionField,
  Expression,
  SymbolLayerStyleProps,
} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {PinType} from '../mapbox-styles/pin-types';
import {SelectedMapItemProperties} from '../types';

// Returns Mapbox Style Expressions to determine map symbol styles.
export const useMapSymbolStyles = (
  selectedFeaturePropertyId: SelectedMapItemProperties['id'],
  pinType: PinType,
  textSizeFactor: number = 1.0,
) => {
  const {themeName} = useThemeContext();
  const isDarkMode = themeName === 'dark';

  const featureId: Expression = ['get', 'id'];
  const selectedFeatureId = selectedFeaturePropertyId || ''; // because mapbox style expressions don't like undefined
  const isSelected: Expression = ['==', featureId, selectedFeatureId];

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
    ['case', ['==', selectedFeatureId, ''], 'default', 'minimized'],
  ];
  const mapItemIconState: Expression = [
    'case',
    isCluster,
    'cluster',
    mapItemIconNonClusterState,
  ];

  const iconSize: Expression = [
    'case',
    pinType === 'station' ? true : isCluster,
    0.855,
    1,
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

  const iconStyle: SymbolLayerStyleProps = {
    iconImage,
    iconSize,
    iconOffset: [0, 0],
    iconAllowOverlap: true,
  };

  const textOffsetXFactor = pinType == 'vehicle' ? 1 : 1.045;
  const numberOfUnits = pinType == 'vehicle' ? count : numVehiclesAvailable;
  const numberOfUnitsLimitedAt99Plus: Expression = [
    'case',
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
    'step',
    numberOfUnits,
    [0.82 * textOffsetXFactor, -0.15],
    100,
    [1.0 * textOffsetXFactor, -0.15],
  ];

  const textSize: Expression = [
    'step',
    numberOfUnits,
    textSizeFactor * 12.6,
    100,
    textSizeFactor * 10.8,
  ];

  const textStyle: SymbolLayerStyleProps = {
    textField,
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
