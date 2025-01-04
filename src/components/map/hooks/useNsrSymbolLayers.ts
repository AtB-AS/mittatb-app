import {MAPBOX_NSR_SOURCE_LAYER_ID} from '@env';
import {useTheme} from '@atb/theme';
import {SelectedFeatureProp} from '../types';

const getNsrLayerSourceProps = (layerId: string) => ({
  sourceID: 'composite',
  sourceLayerID: MAPBOX_NSR_SOURCE_LAYER_ID,
  id: layerId,
});

const minimizedZoomRange = 3;
const opacityTransitionZoomRange = 0.8;

// todo: named props
const getLayerPropsDeterminedByZoomLevel = (
  showAsDefaultAtZoomLevel: number,
  selectedFeature: SelectedFeatureProp['selectedFeature'],
  iconImageProps?: {
    iconCode: string;
    themeName: 'light' | 'dark';
  },
  opacityTransitionZoomRangeDelay: number = 1.5,
  itemFullSize: number = 1,
  textSizeFactor: number = 1,
) => {
  const selectedFeatureId = selectedFeature?.properties?.id || '';
  const aFeatureIsSelected = selectedFeatureId !== '';

  const getExpressionForIconImage = !iconImageProps
    ? () => []
    : (iconType: 'default' | 'minimized') => [
        'concat',
        'stoppin_',
        iconImageProps.iconCode,
        '_',
        ['case', aFeatureIsSelected, 'minimized', iconType],
        '_',
        iconImageProps.themeName,
      ];

  return {
    minZoomLevel: showAsDefaultAtZoomLevel - minimizedZoomRange,
    iconImage: !iconImageProps
      ? undefined
      : [
          'step',
          ['zoom'],
          getExpressionForIconImage('minimized'),
          showAsDefaultAtZoomLevel,
          getExpressionForIconImage('default'),
        ],

    itemSize: [
      'interpolate',
      ['linear'],
      ['zoom'],
      showAsDefaultAtZoomLevel - minimizedZoomRange,
      0,
      showAsDefaultAtZoomLevel,
      itemFullSize,
    ],
    itemOpacity: [
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
      aFeatureIsSelected && opacityTransitionZoomRangeDelay !== 0 // hmm a bit hacky
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
  };
};

export const useNsrSymbolLayers = (
  selectedFeature: SelectedFeatureProp['selectedFeature'],
) => {
  const {themeName} = useTheme();
  return nsrSymbolItems.map((nsrSymbolItem) => {
    const {showAsDefaultAtZoomLevel, iconCode} = nsrSymbolItem;

    const {
      minZoomLevel,
      iconImage,
      itemSize: iconSize,
      itemOpacity: iconOpacity,
      textSize,
      textOpacity,
    } = getLayerPropsDeterminedByZoomLevel(
      showAsDefaultAtZoomLevel,
      selectedFeature,
      {
        iconCode,
        themeName,
      },
    );

    return {
      ...nsrSymbolItem,
      filter: [
        ...nsrSymbolItem.filter,
        ['!=', ['get', 'id'], selectedFeature?.properties?.id ?? ''],
      ],

      ...getNsrLayerSourceProps(nsrSymbolItem.id),

      minZoomLevel,
      style: {
        iconImage,
        iconSize,
        iconOpacity,
        textSize,
        textOpacity,

        textHaloColor:
          themeName === 'light' ? 'hsl(0, 0%, 100%)' : 'hsl(236, 56%, 22%)',
        textColor:
          themeName === 'light' ? 'hsl(236, 56%, 22%)' : 'hsl(0, 0%, 100%)',

        textFont: ['DIN Offc Pro Regular', 'Arial Unicode MS Regular'],
        textField: ['get', 'name'],
        textRadialOffset: 1.2,
        textAllowOverlap: true,
        textVariableAnchor: ['top'],
        textAnchor: 'top',
        textMaxWidth: 7,
        textLineHeight: 0.9,
        textIgnorePlacement: true,
        iconIgnorePlacement: true,
        iconAllowOverlap: true,
        iconPadding: 0,
        iconOffset: [0, 0],
        textTranslate: [0, 0],
        textHaloWidth: 2,
      },
    };
  });
};

const isStopPlaceEntityType = [
  'match',
  ['get', 'entityType'],
  ['StopPlace'],
  true,
  false,
];

const stopPlaceType = ['get', 'stopPlaceType'];
const hasAdjacentSites = ['has', 'adjacentSites'];

// For data from National Stop Registry (NSR) (See https://stoppested.entur.org and https://developer.entur.org/pages-nsr-nsr)
export const nsrSymbolItems = [
  {
    id: 'carparking.nsr.api',
    iconCode: 'commuterparking',
    showAsDefaultAtZoomLevel: 12,
    filter: [
      'all',
      ['match', ['get', 'entityType'], ['Parking'], true, false],
      ['match', ['get', 'parkingVehicleTypes'], ['car'], true, false],
    ],
  },
  {
    id: 'boat.nsr.api',
    iconCode: 'ferry',
    showAsDefaultAtZoomLevel: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['ferryStop'], true, false],
    ],
  },
  {
    id: 'tram.nsr.api',
    iconCode: 'tram',
    showAsDefaultAtZoomLevel: 13,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetTram'], true, false],
      ['!', hasAdjacentSites],
    ],
  },
  {
    id: 'metro.tram.nsr.api',
    iconCode: 'metroandtram', // Bekkestua seems to be the only one matching this
    showAsDefaultAtZoomLevel: 14,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', ['get', 'isPrimaryAdjacentSite'], ['true'], true, false],
      [
        'match',
        ['get', 'finalStopPlaceType'],
        ['localTram_metroStation'],
        true,
        false,
      ],
      hasAdjacentSites,
    ],
  },
  {
    id: 'metro.nsr.api',
    showAsDefaultAtZoomLevel: 14,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['metroStation'], true, false],
      ['!', hasAdjacentSites],
    ],
    iconCode: 'metro',
  },
  {
    id: 'ferjekai.nsr.api',
    iconCode: 'ferry',
    showAsDefaultAtZoomLevel: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['harbourPort'], true, false],
    ],
  },
  {
    id: 'airport.nsr.api',
    iconCode: 'plane',
    showAsDefaultAtZoomLevel: 6,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['airport'], true, false],
      ['match', ['get', 'submode'], ['helicopterService'], false, true],
    ],
  },
  {
    id: 'helicopter.nsr.api',
    iconCode: 'helicopter',
    showAsDefaultAtZoomLevel: 11,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['airport'], true, false],
      ['match', ['get', 'submode'], ['helicopterService'], true, false],
    ],
  },
  {
    id: 'railway.nsr.api',
    iconCode: 'train',
    showAsDefaultAtZoomLevel: 11,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['railStation'], true, false],
      ['match', ['get', 'submode'], ['touristRailway'], false, true],
    ],
  },
  {
    id: 'bus.tram.nsr.api',
    iconCode: 'busandtram',
    showAsDefaultAtZoomLevel: 13,
    filter: [
      'all',
      isStopPlaceEntityType,
      hasAdjacentSites,
      [
        'match',
        ['get', 'finalStopPlaceType'],
        ['onstreetBus_onstreetTram', 'localTram_onstreetBus'],
        true,
        false,
      ],
      ['match', ['get', 'isPrimaryAdjacentSite'], ['true'], true, false],
    ],
  },
  {
    id: 'bussterminal.nsr.api',
    iconCode: 'bus',
    showAsDefaultAtZoomLevel: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['busStation'], true, false],
    ],
  },
  {
    id: 'bus.nsr.api',
    iconCode: 'bus',
    showAsDefaultAtZoomLevel: 13,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetBus'], true, false],
      ['match', ['get', 'submode'], ['railReplacementBus'], false, true],
      ['!', hasAdjacentSites],
    ],
  },
];

const useCircleAndTextItems = () => {
  const {theme} = useTheme();
  return [
    {
      id: 'quays.nsr.api',
      showAsDefaultAtZoomLevel: 17.5,
      filter: ['all', ['match', ['get', 'entityType'], ['Quay'], true, false]],
      circleStyle: {
        circleColor: theme.color.transport.city.primary.background, // '#A2AD00'
        circleStrokeColor: '#ffffff',
        circleStrokeWidth: 1.1,
        circleTranslate: [0, 0],
      },
      textStyle: {
        textFont: ['DIN Offc Pro Regular', 'Arial Unicode MS Regular'],
        textField: ['get', 'publicCode'],
        textColor: theme.color.transport.city.primary.foreground.primary, // '#000000'
        textAllowOverlap: true,
        textHaloColor: '#000000',
        textHaloWidth: 0.3,
      },
    },
  ];
};

const circleFullSizeRadius = 11;

export const useNsrCircleLayers = (
  selectedFeature: SelectedFeatureProp['selectedFeature'],
) => {
  const nsrCircleAndTextItems = useCircleAndTextItems();

  return nsrCircleAndTextItems.map((nsrCircleItem) => {
    const {
      minZoomLevel,
      itemSize: circleRadius,
      itemOpacity: circleOpacity,
    } = getLayerPropsDeterminedByZoomLevel(
      nsrCircleItem.showAsDefaultAtZoomLevel,
      selectedFeature,
      undefined,
      undefined,
      circleFullSizeRadius,
    );
    return {
      ...nsrCircleItem,
      ...getNsrLayerSourceProps(nsrCircleItem.id + '_circle'),
      minZoomLevel,
      style: {
        ...nsrCircleItem.circleStyle,
        circleRadius,
        circleOpacity,
      },
    };
  });
};

export const useNsrTextLayers = (
  selectedFeature: SelectedFeatureProp['selectedFeature'],
) => {
  const nsrCircleAndTextItems = useCircleAndTextItems();

  return nsrCircleAndTextItems.map((nsrTextItem) => {
    const {minZoomLevel, textSize, textOpacity} =
      getLayerPropsDeterminedByZoomLevel(
        nsrTextItem.showAsDefaultAtZoomLevel,
        selectedFeature,
        undefined,
        0,
        undefined,
        0.65,
      );
    return {
      ...nsrTextItem,
      ...getNsrLayerSourceProps(nsrTextItem.id + '_text'),
      minZoomLevel,
      style: {
        ...nsrTextItem.textStyle,
        textSize,
        textOpacity,
      },
    };
  });
};
