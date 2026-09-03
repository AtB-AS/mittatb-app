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
  useGetFareProductsQuery,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {isProductSellableInApp} from '@atb/utils/is-product-sellable-in-app';
import {parse} from 'search-params';
import {parseParamAsInt} from './utils';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';

type ResultState = PartialState<NavigationState> & {
  state?: ResultState;
};

export function useDeepLinks() {
  const {isBonusEnabled} = useFeatureTogglesContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {customerProfile} = useTicketingContext();
  const purchaseSelectionBuilder = usePurchaseSelectionBuilder();

  function getResultStateFromPath(path: string): ResultState {
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

    if (path.includes('details')) {
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

  const linkingOptions: LinkingOptions<RootStackParamList> = {
    prefixes: [`${APP_SCHEME}://`],
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
      if (path.includes('privacy')) {
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
      if (path.includes('points') && isBonusEnabled) {
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

      if (path.includes('purchase-overview')) {
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

      // If the path is not from the widget, behave as usual
      if (!path.includes('widget')) {
        return getStateFromPath(path, config);
      }

      if (path.includes('addFavoriteDeparture')) {
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

      // Get redirected to the preferred departures view
      return getResultStateFromPath(path);
    },
  };
  return linkingOptions;
}
