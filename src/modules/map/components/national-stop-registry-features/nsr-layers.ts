import {
  Expression,
  ExpressionField,
  FilterExpression,
  SymbolLayerStyleProps,
} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {NsrPinIconCode} from '../../mapbox-styles/pin-types';

/**
 * An NsrLayer represents core static data for a layer, specific for National Stop Registry (NSR) data.
 * Further dynamic props are added with hooks to get all props needed for a layer.
 * @property {string} id - A unique identifier for the layer.
 * @property {number} reachFullScaleAtZoomLevel - The zoom level at which the icon reaches full size (and opacity 1) when zooming in.
 * @property {FilterExpression} filter - Filter to select specific NSR items relevant to the layer.
 */
export type NsrLayer = {
  id: string;
  reachFullScaleAtZoomLevel: number;
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
 * @property {NsrPinIconCode} iconCode - The icon code associated with this layer. Should match part of file names chosen for icons in sprites.
 * @property {NsrSymbolLayerTextLocation} textLocation
 */
type NsrSymbolLayer = NsrLayer &
  (
    | {
        iconCode: NsrPinIconCode;
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
  reachFullScaleAtZoomLevel: 17.5,
  filter: ['all', ['match', ['get', 'entityType'], ['Quay'], true, false]],
  textField: ['get', 'publicCode'],
};

export const nsrCircleLayers: NsrCircleLayer[] = [
  {...quaysBaseLayer, id: quaysBaseLayer.id + '_circle'},
];

/**
 * Always use type 'all', which is extendable by appending.
 * Note: cannot include hideItemsInTheDistanceFilter here as this part of the filter
 * is also used not as the root, and ['pitch'] must be used as root in style.
 */
const getAllFilter: (
  filterConditions: ExpressionField[],
) => FilterExpression = (filterConditions) => ['all', ...filterConditions];

const isStopPlaceEntityType: Expression = [
  'match',
  ['get', 'entityType'],
  ['StopPlace'],
  true,
  false,
];
const stopPlaceType: Expression = ['get', 'stopPlaceType'];
const hasAdjacentSites: Expression = ['has', 'adjacentSites'];
const nameTextField: NsrLayer['textField'] = ['get', 'name'];
const busMetroTramStopZoomLevel = 13;

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
    reachFullScaleAtZoomLevel: 13,
    filter: getAllFilter([
      ['match', ['get', 'entityType'], ['Parking'], true, false],
      ['match', ['get', 'parkingVehicleTypes'], ['car'], true, false],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'tram.nsr.api',
    iconCode: 'tram',
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetTram'], true, false],
      ['!', hasAdjacentSites],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'metro.tram.nsr.api',
    iconCode: 'metroandtram', // Bekkestua seems to be the only one matching this
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
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
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'metro.nsr.api',
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['metroStation'], true, false],
      ['!', hasAdjacentSites],
    ]),
    iconCode: 'metro',
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },

  {
    id: 'bus.tram.nsr.api',
    iconCode: 'busandtram',
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
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
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'bussterminal.nsr.api',
    iconCode: 'bus',
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['busStation'], true, false],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'bus.nsr.api',
    iconCode: 'bus',
    reachFullScaleAtZoomLevel: busMetroTramStopZoomLevel,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['onstreetBus'], true, false],
      ['match', ['get', 'submode'], ['railReplacementBus'], false, true],
      ['!', hasAdjacentSites],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'ferjekai.nsr.api',
    iconCode: 'ferry',
    reachFullScaleAtZoomLevel: 12,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['harbourPort'], true, false],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'boat.nsr.api',
    iconCode: 'boat',
    reachFullScaleAtZoomLevel: 12,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['ferryStop'], true, false],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'railway.nsr.api',
    iconCode: 'train',
    reachFullScaleAtZoomLevel: 12,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['railStation'], true, false],
      ['match', ['get', 'submode'], ['touristRailway'], false, true],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'helicopter.nsr.api',
    iconCode: 'helicopter',
    reachFullScaleAtZoomLevel: 10,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['airport'], true, false],
      ['match', ['get', 'submode'], ['helicopterService'], true, false],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
  {
    id: 'airport.nsr.api',
    iconCode: 'plane',
    reachFullScaleAtZoomLevel: 9,
    filter: getAllFilter([
      isStopPlaceEntityType,
      ['match', stopPlaceType, ['airport'], true, false],
      ['match', ['get', 'submode'], ['helicopterService'], false, true],
    ]),
    textField: nameTextField,
    textLocation: NsrSymbolLayerTextLocation.BelowIcon,
  },
];
