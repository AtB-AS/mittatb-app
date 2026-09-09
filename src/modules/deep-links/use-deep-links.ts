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
import {DeepLink, parseDeepLink} from './parse-deep-link';
import {parseParamAsFormFactors, parseParamAsInt} from './utils';
import {initialUrl} from './initial-url';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import {PurchaseSelectionEmptyBuilder} from '@atb/modules/purchase-selection';
import {MapFilterType, useEnableFormFactorsInMapFilter} from '../map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

export function useDeepLinks() {
  const {isBonusEnabled} = useFeatureTogglesContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {customerProfile} = useTicketingContext();
  const purchaseSelectionBuilder = usePurchaseSelectionBuilder();
  const enableFormFactorsInMapFilter = useEnableFormFactorsInMapFilter();

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
    getStateFromPath(pathAndQuery, config) {
      const {path, params} = parseDeepLink(pathAndQuery);

      switch (path) {
        case 'map':
          return routeForMap(params, enableFormFactorsInMapFilter);
        case 'points':
          return routeForBonus(isBonusEnabled);
        case 'privacy':
          return routeForPrivacy();
        case 'purchase-overview':
          return routeForPurchaseOverview(
            params,
            preassignedFareProducts,
            customerProfile,
            purchaseSelectionBuilder,
          );
        case 'widget':
        case 'widgetdetails':
          return routeForWidgetDepartures(path, params);
        case 'widget/addFavoriteDeparture':
          return routeForWidgetAddFavoriteDeparture();
        default:
          return getStateFromPath(pathAndQuery, config);
      }
    },
  };
  return linkingOptions;
}

/**
 * `atb://map?formFactor=scooter`
 */
function routeForMap(
  params: DeepLink['params'],
  enableFormFactorsInMapFilter: (
    formFactors: FormFactor[],
  ) => MapFilterType | undefined,
): ResultState | undefined {
  const formFactors = parseParamAsFormFactors(params.formFactor);
  const initialFilters = enableFormFactorsInMapFilter(formFactors);
  return {
    routes: [
      {
        name: 'Root_TabNavigatorStack',
        state: {
          routes: [
            {
              name: 'TabNav_MapStack',
              state: {
                routes: [
                  {
                    name: 'Map_RootScreen',
                    params: {initialFilters},
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

/**
 * `atb://privacy`
 */
function routeForPrivacy(): ResultState | undefined {
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

/**
 * `atb://points`
 */
function routeForBonus(isBonusEnabled: boolean): ResultState | undefined {
  if (isBonusEnabled) {
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
function routeForPurchaseOverview(
  params: DeepLink['params'],
  preassignedFareProducts: PreassignedFareProduct[],
  customerProfile: CustomerProfile | undefined,
  purchaseSelectionBuilder: PurchaseSelectionEmptyBuilder,
): ResultState | undefined {
  if (params.type) {
    const isSellable = preassignedFareProducts.some(
      (product) =>
        params.type === product.type &&
        isProductSellableInApp(product, customerProfile),
    );
    if (isSellable) {
      const {selection} = purchaseSelectionBuilder.forType(params.type).build();
      return {
        routes: [
          {name: 'Root_TabNavigatorStack'},
          {
            name: 'Root_PurchaseOverviewScreen',
            params: {selection},
          },
        ],
      } as ResultState;
    }
  }
}

/**
 * `atb://widget/addFavoriteDeparture`
 */
function routeForWidgetAddFavoriteDeparture(): ResultState | undefined {
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

/**
 * `atb://widget?stopId=...&stopName=...&quayId=...`
 * `atb://widgetdetails?...&serviceJourneyId=...&serviceDate=...`
 */
function routeForWidgetDepartures(
  path: string,
  params: DeepLink['params'],
): ResultState | undefined {
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

  if (path === 'widgetdetails') {
    const item: ServiceJourneyDeparture = {
      serviceJourneyId: params.serviceJourneyId as string,
      date: params.date || new Date().toISOString(),
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
