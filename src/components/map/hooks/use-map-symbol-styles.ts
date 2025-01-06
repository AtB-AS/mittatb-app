import {useTheme} from '@atb/theme';
import {nsrSymbolItems} from './useNsrSymbolLayers';
import {SelectedFeatureProp} from '../types';

// Returns Mapbox Style Expressions to determine map symbol styles.
export const useMapSymbolStyles = (
  selectedFeature: SelectedFeatureProp['selectedFeature'],
  pinType: 'vehicle' | 'station' | 'stop',
  textSizeFactor: number = 1.0,
) => {
  const {themeName} = useTheme();
  const isDarkMode = themeName === 'dark';

  const featureId = ['get', 'id'];
  const selectedFeatureId = selectedFeature?.properties?.id || '';
  const isSelected = ['==', featureId, selectedFeatureId];

  const count = ['get', 'count'];
  const numVehiclesAvailable = ['get', 'num_vehicles_available'];
  const isCluster = ['all', ['has', 'count'], ['!=', count, 1]];
  const mapItemIconNonClusterState = [
    'case',
    isSelected,
    'selected',
    ['case', ['==', selectedFeatureId, ''], 'default', 'minimized'],
  ];
  const mapItemIconState = [
    'case',
    isCluster,
    'cluster',
    mapItemIconNonClusterState,
  ];

  const iconSize = ['case', isCluster, 0.855, 1];

  const stopPlacesExpression = nsrSymbolItems.flatMap((nsrSymbolItem) => [
    nsrSymbolItem.filter,
    nsrSymbolItem.iconCode,
  ]);

  const vehicle_type_form_factor = ['get', 'vehicle_type_form_factor'];
  const iconCode = [
    'case',
    ...stopPlacesExpression,
    ['==', vehicle_type_form_factor, 'SCOOTER'],
    'scooter',
    ['==', vehicle_type_form_factor, 'BICYCLE'],
    'citybike',
    ['==', vehicle_type_form_factor, 'CAR'],
    'sharedcar',
    'non-existing-icon',
  ];

  const systemId = ['get', 'system_id'];
  const transportOperator = [
    'case',
    ['!', ['has', 'system_id']],
    'generic',
    [
      'case',
      ['==', ['slice', systemId, 0, 4], 'ryde'],
      'ryde',
      ['==', ['slice', systemId, 0, 3], 'voi'],
      'voi',
      ['==', ['slice', systemId, 0, 4], 'tier'],
      'tier',
      'generic',
    ],
  ];
  const suffix =
    pinType === 'vehicle'
      ? ['case', ['==', iconCode, 'scooter'], transportOperator, '']
      : mapItemIconNonClusterState;

  // should make this easier to understand, perhaps rename images to achieve it
  const iconImage = [
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

  const iconStyle = {
    iconImage,
    iconSize,
    iconOffset: [0, 0],
    iconAllowOverlap: true,
  };

  const textOffsetXFactor = pinType == 'vehicle' ? 1 : 1.045;
  const numberOfUnits = pinType == 'vehicle' ? count : numVehiclesAvailable;
  const textField =
    pinType == 'station'
      ? [
          'case',
          ['!=', mapItemIconNonClusterState, 'minimized'],
          numVehiclesAvailable,
          '',
        ]
      : ['case', isCluster, count, ''];

  const textOffset = [
    'step',
    numberOfUnits,
    [0.82 * textOffsetXFactor, -0.15],
    100,
    [1.0 * textOffsetXFactor, -0.15],
    1000,
    [1.25 * textOffsetXFactor, -0.15],
  ];

  const textSize = [
    'step',
    numberOfUnits,
    textSizeFactor * 12.6,
    100,
    textSizeFactor * 10.8,
    1000,
    textSizeFactor * 8.1,
  ];

  const textStyle = {
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
