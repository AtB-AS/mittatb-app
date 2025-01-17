import {
  FilterExpression,
  SymbolLayerStyleProps,
} from '@rnmapbox/maps/src/utils/MapboxStyles';

// Note: The NSR layers are config driven, and could come from firestore if desired.

/**
 * An NsrLayer represents core static data for a layer, specific for National Stop Registry (NSR) data.
 * Further dynamic props are added with hooks to get all props needed for a layer.
 * @property {string} id - A unique identifier for the layer.
 * @property {number} showAsDefaultAtZoomLevel - The zoom level at which the icon switches to default when zooming in.
 * @property {FilterExpression} filter - Filter to select specific NSR items relevant to the layer.
 */
type NsrLayer = {
  id: string;
  showAsDefaultAtZoomLevel: number;
  filter: FilterExpression;
  textField?: SymbolLayerStyleProps['textField'];
};

/**
 * An NsrCircleLayer is an NsrLayer displayed with circles.
 */
type NsrCircleLayer = NsrLayer;

/**
 * Whether the text should be displayed under the icon or in the middle.
 */
export enum NsrSymbolLayerTextLocation {
  BelowIcon,
  InsideCircle,
}

/**
 * An NsrSymbolLayer is an NsrLayer displayed with icons.
 * @property {string} iconCode - The icon code associated with this layer. Should match part of file names chosen for icons in sprites.
 * @property {NsrSymbolLayerTextLocation} textLocation
 */
type NsrSymbolLayer = NsrLayer &
  (
    | {
        iconCode: string;
        textLocation: NsrSymbolLayerTextLocation.BelowIcon;
      }
    | {
        iconCode: undefined;
        textLocation: NsrSymbolLayerTextLocation.InsideCircle;
      }
  );

const quaysBaseLayer: NsrLayer = {
  // Note: Quays from mapbox geojson via the asag repo do not contain info to know which stopPlaceType it belongs to. As a Martin Tile Vector Source though, we can add add this. E.g. then we can select boat instead of city for boat harbour quays.
  id: 'quays.nsr.api',
  showAsDefaultAtZoomLevel: 17.5,
  filter: ['all', ['match', ['get', 'entityType'], ['Quay'], true, false]],
  textField: ['get', 'publicCode'],
};

export const nsrCircleLayers: NsrCircleLayer[] = [
  {...quaysBaseLayer, id: quaysBaseLayer.id + '_circle'},
];

const isStopPlaceEntityType = [
  'match',
  ['get', 'entityType'],
  ['StopPlace'],
  true,
  false,
];
const stopPlaceType = ['get', 'stopPlaceType'];
const hasAdjacentSites = ['has', 'adjacentSites'];
const nameTextField: NsrLayer['textField'] = ['get', 'name'];

export const nsrSymbolLayers: NsrSymbolLayer[] = [
  {
    ...quaysBaseLayer,
    id: quaysBaseLayer.id + '_text',
    iconCode: undefined,
    textLocation: NsrSymbolLayerTextLocation.InsideCircle,
  },
  {
    id: 'carparking.nsr.api',
    iconCode: 'commuterparking',
    showAsDefaultAtZoomLevel: 12,
    filter: [
      'all',
      ['match', ['get', 'entityType'], ['Parking'], true, false],
      ['match', ['get', 'parkingVehicleTypes'], ['car'], true, false],
    ],
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
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
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
];
