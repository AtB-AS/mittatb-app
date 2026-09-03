import {APP_SCHEME} from '@env';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import type {NavigationState, PartialState} from '@react-navigation/routers';
import {
  // eslint-disable-next-line rulesdir/navigation-only-in-screens
  getStateFromPath,
  // eslint-disable-next-line rulesdir/navigation-only-in-screens
  LinkingOptions,
  Route,
  PartialRoute,
} from '@react-navigation/native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  CustomerProfile,
  PreassignedFareProduct,
  useGetFareProductsQuery,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {isProductSellableInApp} from '@atb/utils/is-product-sellable-in-app';
import {parse} from 'search-params';
import {parseParamAsInt} from './utils';
import {initialUrl} from './initial-url';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import {PurchaseSelectionEmptyBuilder} from '@atb/modules/purchase-selection';

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

export function useDeepLinks() {
  const {isBonusEnabled} = useFeatureTogglesContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {customerProfile} = useTicketingContext();
  const purchaseSelectionBuilder = usePurchaseSelectionBuilder();

  const linkingOptions: LinkingOptions<RootStackParamList> = {
    prefixes: [`${APP_SCHEME}://`],
    getInitialURL: () => initialUrl,
    config: {
      screens: {
        Root_TabNavigatorStack: {
          screens: {
            TabNav_ProfileStack: 'profile',
            TabNav_TicketingStack: {
              screens: {
                Ticketing_RootScreen: {
                  screens: {
                    TicketTabNav_AvailableFareContractsTabScreen: 'ticketing',
                  },
                },
              },
            },
          },
        },
      },
    },
    getStateFromPath(path, config) {
      const stateForPrivacy = getStateForPrivacy(path);
      if (stateForPrivacy) return stateForPrivacy;

      const stateForBonus = getStateForBonus(path, isBonusEnabled);
      if (stateForBonus) return stateForBonus;

      const stateForPurchaseOverview = getStateForPurchaseOverview(
        path,
        preassignedFareProducts,
        customerProfile,
        purchaseSelectionBuilder,
      );
      if (stateForPurchaseOverview) return stateForPurchaseOverview;

      const stateForAddFavoriteDeparture =
        getStateForWidgetAddFavoriteDeparture(path);
      if (stateForAddFavoriteDeparture) return stateForAddFavoriteDeparture;

      const stateForWidgetDepartures = getStateForWidgetDepartures(path);
      if (stateForWidgetDepartures) return stateForWidgetDepartures;

      return getStateFromPath(path, config);
    },
  };
  return linkingOptions;
}

/**
 * `atb://privacy`
 */
function getStateForPrivacy(path: string): ResultState | undefined {
  if (path.startsWith('privacy')) {
    return {
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
                    {
                      name: 'Profile_PrivacyScreen',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    } as ResultState;
  }
}

/**
 * `atb://points`
 */
function getStateForBonus(
  path: string,
  isBonusEnabled: boolean,
): ResultState | undefined {
  if (path.startsWith('points') && isBonusEnabled) {
    return {
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
                    {
                      name: 'Profile_BonusScreen',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    } as ResultState;
  }
}

/**
 * `atb://purchase-overview?type=period`
 */
function getStateForPurchaseOverview(
  path: string,
  preassignedFareProducts: PreassignedFareProduct[],
  customerProfile: CustomerProfile | undefined,
  purchaseSelectionBuilder: PurchaseSelectionEmptyBuilder,
): ResultState | undefined {
  if (path.startsWith('purchase-overview')) {
    const params = new URLSearchParams(path.split('?')[1]);
    const type = params.get('type');
    if (type) {
      const isSellable = preassignedFareProducts.some(
        (product) =>
          type === product.type &&
          isProductSellableInApp(product, customerProfile),
      );
      if (isSellable) {
        const {selection} = purchaseSelectionBuilder.forType(type).build();
        return {
          routes: [
            {
              name: 'Root_PurchaseOverviewScreen',
              params: {selection},
            },
          ],
        } as ResultState;
      }
    }
  }
}

/**
 * `atb://widget/addFavoriteDeparture`
 */
function getStateForWidgetAddFavoriteDeparture(
  path: string,
): ResultState | undefined {
  if (path.startsWith('widget/addFavoriteDeparture')) {
    return {
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
    } as ResultState;
  }
}

/**
 * `atb://widget?stopId=...&stopName=...&quayId=...`
 *
 * `atb://widgetdetails?...&serviceJourneyId=...&serviceDate=...`
 */
function getStateForWidgetDepartures(path: string): ResultState | undefined {
  if (path.startsWith('widget')) {
    const params = parse(path);
    const destination: PartialRoute<any>[] = [
      {
        // Index is needed so that the user can go back after
        // opening the app with the widget when it was not open previously
        index: 0,
        name: 'Departures_NearbyStopPlacesScreen',
      },
      {
        name: 'Departures_PlaceScreen',
        index: 1,
        params: {
          place: {
            name: params.stopName,
            id: params.stopId,
          },
          selectedQuayId: params.quayId,
          showOnlyFavoritesByDefault: true,
          mode: 'Departure',
        },
      },
    ];

    if (path.startsWith('widgetdetails')) {
      const item: ServiceJourneyDeparture = {
        serviceJourneyId: params.serviceJourneyId as string,
        date: (params.date as string) || new Date().toISOString(),
        serviceDate: params.serviceDate as string,
        fromStopPosition: parseParamAsInt(params.fromStopPosition) || 0,
        toStopPosition: parseParamAsInt(params.toStopPosition),
      };
      destination.push({
        name: 'Departures_DepartureDetailsScreen',
        params: {
          activeItemIndex: 0,
          items: [item],
        },
      });
    }

    return {
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_DeparturesStack',
                state: {
                  routes: destination as PartialRoute<Route<string>>[],
                },
              },
            ],
          },
        },
      ],
    };
  }
}
