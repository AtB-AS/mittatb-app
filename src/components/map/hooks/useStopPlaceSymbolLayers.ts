import {useTheme} from '@atb/theme';
import {Feature, Point, GeoJsonProperties} from 'geojson';

const paintPropsLightMode = {
  textHaloColor: 'hsl(0, 0%, 100%)',
  textColor: 'hsl(236, 56%, 22%)',
};
const paintPropsDarkMode = {
  textHaloColor: 'hsl(236, 56%, 22%)',
  textColor: 'hsl(0, 0%, 100%)',
};

// todo: also support quays, such as "P1" and "P2"

export const useStopPlaceSymbolLayers = (
  selectedFeature: Feature<Point, GeoJsonProperties> | undefined,
) => {
  const {themeName} = useTheme();
  return nsrItems.map((nsrItem) => {
    const selectedFeatureId = selectedFeature?.properties?.id || '';
    const aFeatureIsSelected = selectedFeatureId !== '';

    const getIconImage = (iconType: 'default' | 'minimized') => [
      'concat',
      'stoppin_',
      nsrItem.iconCode,
      '_',
      ['case', aFeatureIsSelected, 'minimized', iconType],
      '_',
      themeName,
    ];

    const textSize = {
      textSize: ['interpolate', ['exponential', 1.5], ['zoom'], 14, 13, 22, 27],
    };

    const textOpacity = {
      textOpacity: aFeatureIsSelected
        ? 0
        : [
            'interpolate',
            ['linear'],
            ['zoom'],
            Math.max(nsrItem.showDefaultIconZoom + 1.5, 13.75) - 1,
            0,
            Math.max(nsrItem.showDefaultIconZoom + 1.5, 13.75),
            1,
          ],
    };

    return {
      ...nsrItem,
      filter: [
        ...nsrItem.filter,
        ['!=', ['get', 'id'], selectedFeature?.properties?.id ?? ''],
      ],
      sourceID: 'composite',
      sourceLayerID: 'foo-6pzjnl',
      id: `${nsrItem.id}_unique`, // add _unique for now since these are also in the style from mapbox, and ids can't have conflicts
      minZoomLevel: nsrItem.showDefaultIconZoom - 3,
      style: {
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
        iconImage: [
          'step',
          ['zoom'],
          getIconImage('minimized'),
          nsrItem.showDefaultIconZoom,
          getIconImage('default'),
        ],
        iconSize: [
          'interpolate',
          ['linear'],
          ['zoom'],
          nsrItem.showDefaultIconZoom - 3,
          0,
          nsrItem.showDefaultIconZoom,
          1,
        ],
        iconOffset: [0, 0],
        iconOpacity: [
          'interpolate',
          ['linear'],
          ['zoom'],
          nsrItem.showDefaultIconZoom - 3,
          0,
          nsrItem.showDefaultIconZoom - 2,
          1,
        ],

        textTranslate: [0, 0],
        textHaloWidth: 2,
        ...(themeName === 'light' ? paintPropsLightMode : paintPropsDarkMode),
        ...textSize,
        ...textOpacity,
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

// For data from National Stop Registry (NSR)
export const nsrItems = [
  {
    id: 'boat.nsr.api',
    iconCode: 'ferry',
    showDefaultIconZoom: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['ferryStop'], true, false],
    ],
  },
  {
    id: 'tram.nsr.api',
    iconCode: 'tram',
    showDefaultIconZoom: 13,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetTram'], true, false],
      ['!', hasAdjacentSites],
    ],
  },
  {
    id: 'metro.tram.nsr.api',
    iconCode: 'metroandtram',
    showDefaultIconZoom: 14,
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
    showDefaultIconZoom: 14,
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
    showDefaultIconZoom: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['harbourPort'], true, false],
    ],
  },
  {
    id: 'helicopter.nsr.api',
    iconCode: 'helicopter',
    showDefaultIconZoom: 11,
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
    showDefaultIconZoom: 11,
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
    showDefaultIconZoom: 13,
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
    id: 'airport.nsr.api',
    iconCode: 'plane',
    showDefaultIconZoom: 6,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['airport'], true, false],
      ['match', ['get', 'submode'], ['helicopterService'], false, true],
    ],
  },
  {
    id: 'bussterminal.nsr.api',
    iconCode: 'bus',
    showDefaultIconZoom: 10,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['busStation'], true, false],
    ],
  },
  {
    id: 'bus.nsr.api',
    iconCode: 'bus',
    showDefaultIconZoom: 13,
    filter: [
      'all',
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetBus'], true, false],
      ['match', ['get', 'submode'], ['railReplacementBus'], false, true],
      ['!', hasAdjacentSites],
    ],
  },
];
