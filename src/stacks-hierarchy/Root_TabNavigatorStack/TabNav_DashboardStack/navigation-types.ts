import {DepartureDetailsScreenParams} from '@atb/screen-components/travel-details-screens';
import {TravelDetailsMapScreenParams} from '@atb/screen-components/travel-details-map-screen';
import {PlaceScreenParams} from '@atb/screen-components/place-screen';
import {TripDetailsScreenParams} from '@atb/screen-components/travel-details-screens';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TripSearchScreenParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {NearbyStopPlacesScreenParams} from '@atb/screen-components/nearby-stop-places';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {TravelAidScreenParams} from '@atb/screen-components/travel-aid';
import {SelectFavoriteDeparturesScreenParams} from './Dashboard_SelectFavoriteDeparturesScreen';

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

type CloseRouteNames =
  | 'Dashboard_FavoriteDeparturesScreen'
  | 'Dashboard_RootScreen';

type Dashboard_NearbyStopPlacesScreenParams = NearbyStopPlacesScreenParams & {
  onCloseRouteName: CloseRouteNames;
};
type Dashboard_PlaceScreenParams = PlaceScreenParams & {
  onCloseRouteName?: CloseRouteNames;
};
type Dashboard_SelectFavoriteDeparturesScreenParams =
  SelectFavoriteDeparturesScreenParams & {
    onCloseRouteName: CloseRouteNames;
  };

export type DashboardStackParams = StackParams<{
  Dashboard_RootScreen: DashboardRootScreenParams;
  Dashboard_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Dashboard_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Dashboard_PlaceScreen: Dashboard_PlaceScreenParams;
  Dashboard_SelectFavoriteDeparturesScreen: Dashboard_SelectFavoriteDeparturesScreenParams;
  Dashboard_TripSearchScreen: TripSearchScreenParams;
  Dashboard_TripDetailsScreen: TripDetailsScreenParams;
  Dashboard_FavoriteDeparturesScreen: undefined;
  Dashboard_NearbyStopPlacesScreen: Dashboard_NearbyStopPlacesScreenParams;
  Dashboard_TravelAidScreen: TravelAidScreenParams;
}>;

export type RootDashboardScreenProps =
  TabNavigatorScreenProps<'TabNav_DashboardStack'>;

export type DashboardScreenProps<T extends keyof DashboardStackParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardStackParams, T>,
    RootDashboardScreenProps
  >;
