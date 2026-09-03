import {renderHook} from '@testing-library/react-native';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useDeepLinkOptions} from '../use-deep-link-options';

let mockIsBonusEnabled = false;
let mockPreassignedFareProducts: PreassignedFareProduct[] = [];
let mockCustomerProfile: {debug?: boolean} | undefined = undefined;

const mockSelection = {id: 'test-selection'};
const mockForType = jest.fn((_type: string) => ({
  build: () => ({selection: mockSelection}),
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

/**
 * React Navigation strips the app scheme prefix before calling
 * `getStateFromPath`, so tests state the full deep link as it is sent from the
 * widget or a QR code, and hand the hook what the navigator would.
 *
 * See `extractPathFromURL` in @react-navigation/native.
 */
const toPath = (url: string) => url.replace(/^[a-z-]+:\/+/, '');

const getStateFrom = (url: string) => {
  const {result} = renderHook(() => useDeepLinkOptions());
  const {getStateFromPath, config} = result.current;
  return getStateFromPath!(toPath(url), config);
};

beforeEach(() => {
  mockIsBonusEnabled = false;
  mockPreassignedFareProducts = [];
  mockCustomerProfile = undefined;
  mockForType.mockClear();
});

describe('prefixes', () => {
  it('only handles the app scheme', () => {
    const {result} = renderHook(() => useDeepLinkOptions());
    expect(result.current.prefixes).toHaveLength(1);
    expect(result.current.prefixes![0]).toMatch(/^[a-z-]+:\/\/$/);
  });
});

describe('linking config', () => {
  it('opens the profile tab', () => {
    expect(getStateFrom('atb://profile')).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {routes: [{name: 'TabNav_ProfileStack', path: 'profile'}]},
        },
      ],
    });
  });

  it('opens valid fare contracts in the ticketing tab', () => {
    expect(getStateFrom('atb://ticketing')).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_TicketingStack',
                state: {
                  routes: [
                    {
                      name: 'Ticketing_RootScreen',
                      state: {
                        routes: [
                          {
                            name: 'TicketTabNav_AvailableFareContractsTabScreen',
                            path: 'ticketing',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('does not handle unknown paths', () => {
    // The purchase callback is handled by the in-app browser, not navigation
    expect(getStateFrom('atb://purchase-callback')).toBeUndefined();
  });
});

describe('privacy', () => {
  it('opens the privacy screen on top of the profile screen', () => {
    expect(getStateFrom('atb://privacy')).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_ProfileStack',
                state: {
                  routes: [
                    {name: 'Profile_RootScreen'},
                    {name: 'Profile_PrivacyScreen'},
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });
});

describe('points', () => {
  it('opens the bonus screen when bonus is enabled', () => {
    mockIsBonusEnabled = true;
    expect(getStateFrom('atb://points')).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_ProfileStack',
                state: {
                  routes: [
                    {name: 'Profile_RootScreen'},
                    {name: 'Profile_BonusScreen'},
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('is not handled when bonus is disabled', () => {
    mockIsBonusEnabled = false;
    expect(getStateFrom('atb://points')).toBeUndefined();
  });
});

describe('purchase-overview', () => {
  it('opens purchase overview for a product sellable in the app', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    expect(getStateFrom('atb://purchase-overview?type=single')).toEqual({
      routes: [
        {
          name: 'Root_PurchaseOverviewScreen',
          params: {selection: mockSelection},
        },
      ],
    });
    expect(mockForType).toHaveBeenCalledWith('single');
  });

  it('opens purchase overview for a debug product when the customer is debug', () => {
    mockPreassignedFareProducts = [
      {...TEST_PRODUCT, distributionChannel: ['debug-app']},
    ];
    mockCustomerProfile = {debug: true};
    expect(getStateFrom('atb://purchase-overview?type=single')).toEqual({
      routes: [
        {
          name: 'Root_PurchaseOverviewScreen',
          params: {selection: mockSelection},
        },
      ],
    });
  });

  it('is not handled when the product is not sellable in the app', () => {
    mockPreassignedFareProducts = [
      {...TEST_PRODUCT, distributionChannel: ['web']},
    ];
    expect(getStateFrom('atb://purchase-overview?type=single')).toBeUndefined();
    expect(mockForType).not.toHaveBeenCalled();
  });

  it('is not handled for an unknown product type', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    expect(getStateFrom('atb://purchase-overview?type=period')).toBeUndefined();
  });

  it('is not handled without a type', () => {
    mockPreassignedFareProducts = [TEST_PRODUCT];
    expect(getStateFrom('atb://purchase-overview')).toBeUndefined();
  });
});

describe('widget', () => {
  // Links as built by `WidgetViewModel.deepLink` in ios/departureWidget
  const stopParams =
    'stopId=NSR:StopPlace:41613&stopName=Prinsens%20gate&quayId=NSR:Quay:71184&latitude=63.4326&longitude=10.3951';

  it('opens nearby stop places in favourite mode when there are no favourite departures', () => {
    expect(getStateFrom('atb://widget/addFavoriteDeparture')).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_DashboardStack',
                state: {
                  routes: [
                    {name: 'Dashboard_RootScreen', index: 0},
                    {
                      name: 'Dashboard_NearbyStopPlacesScreen',
                      params: {mode: 'Favourite'},
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('opens the quay with only favourite departures', () => {
    expect(getStateFrom(`atb://widget?${stopParams}`)).toEqual({
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_DeparturesStack',
                state: {
                  routes: [
                    {name: 'Departures_NearbyStopPlacesScreen', index: 0},
                    {
                      name: 'Departures_PlaceScreen',
                      index: 1,
                      params: {
                        place: {
                          id: 'NSR:StopPlace:41613',
                          name: 'Prinsens gate',
                        },
                        selectedQuayId: 'NSR:Quay:71184',
                        showOnlyFavoritesByDefault: true,
                        mode: 'Departure',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('opens departure details on top of the quay', () => {
    const url =
      `atb://widgetdetails?${stopParams}` +
      '&serviceJourneyId=ATB:ServiceJourney:1_1&date=2026-09-03T07:45:00Z' +
      '&serviceDate=2026-09-03&fromStopPosition=13';

    const state = getStateFrom(url);
    const departuresRoutes = (state as any).routes[0].state.routes[0].state
      .routes;

    expect(departuresRoutes[2]).toEqual({
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
      `atb://widgetdetails?${stopParams}&serviceJourneyId=ATB:ServiceJourney:1_1&serviceDate=2026-09-03&fromStopPosition=0`,
    );
    jest.useRealTimers();

    const details = (state as any).routes[0].state.routes[0].state.routes[2];
    expect(details.params.items[0].date).toBe('2026-09-03T07:45:00.000Z');
    expect(details.params.items[0].fromStopPosition).toBe(0);
  });
});
