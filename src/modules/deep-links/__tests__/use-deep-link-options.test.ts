import {renderHook} from '@testing-library/react-native';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useDeepLinks} from '../use-deep-links';

let mockIsBonusEnabled = false;
let mockPreassignedFareProducts: PreassignedFareProduct[] = [];
let mockCustomerProfile: {debug?: boolean} | undefined = undefined;

const mockSelection = {id: 'test-selection'};
const mockForType = jest.fn((_type: string) => ({
  build: () => ({selection: mockSelection}),
}));
const mockEnableFormFactorsInMapFilter = jest.fn((formFactors: string[]) => ({
  mobility: formFactors,
}));

jest.mock('@atb/modules/feature-toggles', () => ({
  useFeatureTogglesContext: () => ({isBonusEnabled: mockIsBonusEnabled}),
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

beforeEach(() => {
  mockIsBonusEnabled = false;
  mockPreassignedFareProducts = [];
  mockCustomerProfile = undefined;
  mockForType.mockClear();
  mockEnableFormFactorsInMapFilter.mockClear();
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
      index: 1,
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
