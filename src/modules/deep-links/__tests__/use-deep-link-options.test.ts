import {APP_SCHEME} from '@env';
import {renderHook} from '@testing-library/react-native';
import {Linking} from 'react-native';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useDeepLinks} from '../use-deep-links';

let mockIsBonusEnabled = false;
let mockPreassignedFareProducts: PreassignedFareProduct[] = [];
let mockCustomerProfile: {debug?: boolean} | undefined = undefined;

const mockPlaceV3 = jest.fn();
const mockReverseV3 = jest.fn();

const mockSelection = {id: 'test-selection'};
const mockForType = jest.fn((_type: string) => ({
  build: () => ({selection: mockSelection}),
}));
const mockEnableFormFactorsInMapFilter = jest.fn((formFactors: string[]) => ({
  mobility: formFactors,
}));

jest.mock('@atb/modules/feature-toggles', () => ({
  useFeatureTogglesContext: () => ({
    isBonusEnabled: mockIsBonusEnabled,
  }),
}));
jest.mock('@atb/api', () => ({
  placeV3: (...args: any[]) => mockPlaceV3(...args),
  reverseV3: (...args: any[]) => mockReverseV3(...args),
}));
jest.mock('@atb/modules/ticketing', () => ({
  useGetFareProductsQuery: () => ({data: mockPreassignedFareProducts}),
  useTicketingContext: () => ({customerProfile: mockCustomerProfile}),
}));
jest.mock('@atb/modules/purchase-selection', () => ({
  usePurchaseSelectionBuilder: () => ({forType: mockForType}),
}));
jest.mock('@atb/modules/map', () => ({
  useEnableFormFactorsInMapFilter: () => mockEnableFormFactorsInMapFilter,
}));
// Unused by the hook, but imported by ./utils, and pulls in native modules
jest.mock('@atb/modules/fare-zones-selector', () => ({}));

const TEST_PRODUCT = {
  id: 'P1',
  type: 'single',
  name: {lang: 'no', value: 'Enkeltbillett'},
  version: 'v1',
  limitations: {},
  distributionChannel: ['app'],
} as PreassignedFareProduct;

const getStateFrom = (url: string) => {
  const {result} = renderHook(() => useDeepLinks());
  const {getStateFromPath, config} = result.current;
  return getStateFromPath!(url, config);
};

/**
 * Recursively searches a route object for a screen with a matching `name`.
 */
const findRoute = (state: any, name: string): any =>
  state?.routes?.reduce(
    (found: any, route: any) =>
      found ?? (route.name === name ? route : findRoute(route.state, name)),
    undefined,
  );

/**
 * Runs a url through the linking subscription, like an incoming deep link
 * would, so that async lookups are done before the state is resolved.
 */
const getStateAfterLookupFrom = async (url: string) => {
  const {result} = renderHook(() => useDeepLinks());
  const {subscribe, getStateFromPath, config} = result.current;
  const handled = new Promise<void>((resolve) => subscribe!(() => resolve()));
  onUrl({url: `${APP_SCHEME}://${url}`});
  await handled;
  return getStateFromPath!(url, config);
};

let onUrl: (event: {url: string}) => void = () => {};

beforeEach(() => {
  mockIsBonusEnabled = false;
  mockPreassignedFareProducts = [];
  mockCustomerProfile = undefined;
  mockForType.mockClear();
  mockEnableFormFactorsInMapFilter.mockClear();
  mockPlaceV3.mockReset();
  mockReverseV3.mockReset();
  jest
    .spyOn(Linking, 'addEventListener')
    .mockImplementation((_type, callback) => {
      onUrl = callback;
      return {remove: jest.fn()} as any;
    });
});

describe('prefixes', () => {
  it('only handles the app scheme', () => {
    const {result} = renderHook(() => useDeepLinks());
    expect(result.current.prefixes).toHaveLength(1);
    expect(result.current.prefixes![0]).toMatch(/^[a-z-]+:\/\/$/);
  });
});

describe('linking config', () => {
  it('opens the profile tab', () => {
    const state = getStateFrom('profile');
    expect(findRoute(state, 'TabNav_ProfileStack')).toEqual({
      name: 'TabNav_ProfileStack',
      path: 'profile',
    });
  });

  it('opens valid fare contracts in the ticketing tab', () => {
    const state = getStateFrom('ticketing');
    expect(
      findRoute(state, 'TicketTabNav_AvailableFareContractsTabScreen'),
    ).toEqual({
      name: 'TicketTabNav_AvailableFareContractsTabScreen',
      path: 'ticketing',
    });
  });

  it('does not handle unknown paths', () => {
    // The purchase callback is handled by the in-app browser, not navigation
    expect(getStateFrom('purchase-callback')).toBeUndefined();
  });
});

describe('privacy', () => {
  it('opens the privacy screen on top of the profile screen', () => {
    const state = getStateFrom('privacy');
    expect(findRoute(state, 'Profile_PrivacyScreen')).toBeDefined();
  });
});

describe('points', () => {
  it('opens the bonus screen when bonus is enabled', () => {
    mockIsBonusEnabled = true;
    const state = getStateFrom('points');
    expect(findRoute(state, 'Profile_BonusScreen')).toBeDefined();
  });

  it('is not handled when bonus is disabled', () => {
    mockIsBonusEnabled = false;
    expect(getStateFrom('points')).toBeUndefined();
  });
});

describe('purchase-overview', () => {
  it('opens purchase overview for a product sellable in the app', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    const state = getStateFrom('purchase-overview?type=single');
    expect(findRoute(state, 'Root_PurchaseOverviewScreen')).toEqual({
      name: 'Root_PurchaseOverviewScreen',
      params: {selection: mockSelection},
    });
    expect(mockForType).toHaveBeenCalledWith('single');
  });

  it('opens purchase overview for a debug product when the customer is debug', () => {
    mockPreassignedFareProducts = [
      {...TEST_PRODUCT, distributionChannel: ['debug-app']},
    ];
    mockCustomerProfile = {debug: true};
    const state = getStateFrom('purchase-overview?type=single');
    expect(findRoute(state, 'Root_PurchaseOverviewScreen')).toEqual({
      name: 'Root_PurchaseOverviewScreen',
      params: {selection: mockSelection},
    });
  });

  it('is not handled when the product is not sellable in the app', () => {
    mockPreassignedFareProducts = [
      {...TEST_PRODUCT, distributionChannel: ['web']},
    ];
    expect(getStateFrom('purchase-overview?type=single')).toBeUndefined();
    expect(mockForType).not.toHaveBeenCalled();
  });

  it('is not handled for an unknown product type', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    expect(getStateFrom('purchase-overview?type=fake')).toBeUndefined();
  });

  it('is not handled without a type', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    expect(getStateFrom('purchase-overview')).toBeUndefined();
  });
});

describe('map', () => {
  it('opens the map with the requested form factors filtered in', () => {
    const state = getStateFrom('map?formFactor=scooter,bicycle');
    expect(findRoute(state, 'Map_RootScreen')).toEqual({
      name: 'Map_RootScreen',
      params: {initialFilters: {mobility: ['SCOOTER', 'BICYCLE']}},
    });
  });

  it('ignores invalid form factors', () => {
    getStateFrom('map?formFactor=scooter,pogo_stick');
    expect(mockEnableFormFactorsInMapFilter).toHaveBeenCalledWith(['SCOOTER']);
  });

  it('opens the map without form factors', () => {
    const state = getStateFrom('map');
    expect(findRoute(state, 'Map_RootScreen')).toBeDefined();
    expect(mockEnableFormFactorsInMapFilter).toHaveBeenCalledWith([]);
  });
});

describe('trip', () => {
  // As mapped from the `/bff/v2/geocoder/place` response
  const PLACES: Record<string, any> = {
    'NSR:StopPlace:337': {
      id: 'NSR:StopPlace:337',
      name: 'Oslo S',
      label: 'Oslo S, Oslo',
      layer: 'venue',
      coordinates: {latitude: 59.910925, longitude: 10.753276},
      locality: 'Oslo',
      fare_zones: ['RUT:FareZone:4'],
      category: ['railStation'],
      resultType: 'search',
    },
    'NSR:GroupOfStopPlaces:1': {
      id: 'NSR:GroupOfStopPlaces:1',
      name: 'Oslo',
      label: 'Oslo, Oslo',
      layer: 'address',
      coordinates: {latitude: 59.911076, longitude: 10.748128},
      locality: 'Oslo',
      category: [],
      resultType: 'search',
    },
  };

  const ADDRESS = {
    id: 'NSR:Address:1',
    name: 'Kongens gate 1',
    layer: 'address',
    coordinates: {latitude: 63.4326, longitude: 10.3951},
    category: [],
    resultType: 'search',
  };

  beforeEach(() => {
    mockPlaceV3.mockImplementation((ids: string[]) =>
      Promise.resolve(ids.map((id) => PLACES[id]).filter(Boolean)),
    );
    mockReverseV3.mockResolvedValue([ADDRESS]);
  });

  const tripParams = (state: any) =>
    findRoute(state, 'Dashboard_TripSearchScreen').params;

  it('looks up ids in the geocoder', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromId=NSR:StopPlace:337&toId=NSR:GroupOfStopPlaces:1',
    );
    expect(mockPlaceV3).toHaveBeenCalledWith(['NSR:StopPlace:337']);
    expect(mockPlaceV3).toHaveBeenCalledWith(['NSR:GroupOfStopPlaces:1']);
    expect(tripParams(state)).toEqual({
      fromLocation: PLACES['NSR:StopPlace:337'],
      toLocation: PLACES['NSR:GroupOfStopPlaces:1'],
    });
  });

  it('reverse geocodes coordinates', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromLat=63.4326&fromLon=10.3951&toLat=63.4402&toLon=10.4004',
    );
    expect(mockReverseV3).toHaveBeenCalledWith({
      latitude: 63.4326,
      longitude: 10.3951,
    });
    expect(mockReverseV3).toHaveBeenCalledWith({
      latitude: 63.4402,
      longitude: 10.4004,
    });
    expect(tripParams(state)).toEqual({
      fromLocation: ADDRESS,
      toLocation: ADDRESS,
    });
  });

  it('mixes ids and coordinates', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromId=NSR:StopPlace:337&toLat=63.4402&toLon=10.4004',
    );
    expect(tripParams(state)).toEqual({
      fromLocation: PLACES['NSR:StopPlace:337'],
      toLocation: ADDRESS,
    });
  });

  it('leaves out unknown ids', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromId=NSR:StopPlace:99999999&toLat=63.4402&toLon=10.4004',
    );
    expect(tripParams(state)).toEqual({
      fromLocation: undefined,
      toLocation: ADDRESS,
    });
  });

  it('ignores places which do not match the requested id', async () => {
    mockPlaceV3.mockResolvedValue([PLACES['NSR:GroupOfStopPlaces:1']]);
    const state = await getStateAfterLookupFrom(
      'trip?fromId=NSR:StopPlace:337&toLat=63.4402&toLon=10.4004',
    );
    expect(tripParams(state).fromLocation).toBeUndefined();
  });

  it('leaves out locations which can not be looked up', async () => {
    mockPlaceV3.mockRejectedValue(new Error('nope'));
    const state = await getStateAfterLookupFrom(
      'trip?fromId=NSR:StopPlace:337&toLat=63.4402&toLon=10.4004',
    );
    expect(tripParams(state)).toEqual({
      fromLocation: undefined,
      toLocation: ADDRESS,
    });
  });

  it('leaves out invalid coordinates', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromLat=93.4326&fromLon=10.3951&toLat=63.4402&toLon=10.4004',
    );
    expect(mockReverseV3).toHaveBeenCalledTimes(1);
    expect(tripParams(state)).toEqual({
      fromLocation: undefined,
      toLocation: ADDRESS,
    });
  });

  it('leaves out half specified coordinates', async () => {
    const state = await getStateAfterLookupFrom(
      'trip?fromLat=63.4326&toLat=63.4402&toLon=10.4004',
    );
    expect(mockReverseV3).toHaveBeenCalledTimes(1);
    expect(tripParams(state)).toEqual({
      fromLocation: undefined,
      toLocation: ADDRESS,
    });
  });

  it('is not handled before the locations are looked up', () => {
    const {result} = renderHook(() => useDeepLinks());
    expect(
      result.current.getStateFromPath!(
        'trip?fromId=NSR:StopPlace:337',
        result.current.config,
      ),
    ).toBeUndefined();
  });
});

describe('widget', () => {
  // Links as built by `WidgetViewModel.deepLink` in ios/departureWidget
  const stopParams =
    'stopId=NSR:StopPlace:41613&quayId=NSR:Quay:71184&latitude=63.4326&longitude=10.3951';

  it('opens nearby stop places in favourite mode when there are no favourite departures', () => {
    const state = getStateFrom('widget/addFavoriteDeparture');
    expect(findRoute(state, 'Dashboard_NearbyStopPlacesScreen')).toEqual({
      name: 'Dashboard_NearbyStopPlacesScreen',
      params: {mode: 'Favourite'},
    });
  });

  it('opens the quay with only favourite departures', () => {
    const state = getStateFrom(`widget?${stopParams}`);
    expect(findRoute(state, 'Departures_PlaceScreen')).toEqual({
      name: 'Departures_PlaceScreen',
      params: {
        place: {id: 'NSR:StopPlace:41613'},
        selectedQuayId: 'NSR:Quay:71184',
        showOnlyFavoritesByDefault: true,
        mode: 'Departure',
      },
    });
  });

  it('opens departure details on top of the quay', () => {
    const url =
      `widgetdetails?${stopParams}` +
      '&serviceJourneyId=ATB:ServiceJourney:1_1&date=2026-09-03T07:45:00Z' +
      '&serviceDate=2026-09-03&fromStopPosition=13';

    const state = getStateFrom(url);
    expect(findRoute(state, 'Departures_DepartureDetailsScreen')).toEqual({
      name: 'Departures_DepartureDetailsScreen',
      params: {
        activeItemIndex: 0,
        items: [
          {
            serviceJourneyId: 'ATB:ServiceJourney:1_1',
            date: '2026-09-03T07:45:00Z',
            serviceDate: '2026-09-03',
            fromStopPosition: 13,
            toStopPosition: undefined,
          },
        ],
      },
    });
  });

  it('falls back to now when the departure has no date', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-03T07:45:00Z'));
    const state = getStateFrom(
      `widgetdetails?${stopParams}&serviceJourneyId=ATB:ServiceJourney:1_1&serviceDate=2026-09-03&fromStopPosition=0`,
    );
    jest.useRealTimers();

    const details = findRoute(state, 'Departures_DepartureDetailsScreen');
    expect(details.params.items[0].date).toBe('2026-09-03T07:45:00.000Z');
    expect(details.params.items[0].fromStopPosition).toBe(0);
  });
});
