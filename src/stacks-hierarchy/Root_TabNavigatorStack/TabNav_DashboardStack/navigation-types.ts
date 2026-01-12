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

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

type Dashboard_NearbyStopPlacesScreenParams = NearbyStopPlacesScreenParams & {
  onCloseRoute: Parameters<
    DashboardScreenProps<'Dashboard_NearbyStopPlacesScreen'>['navigation']['popTo']
  >;
};

type Dashboard_PlaceScreenParams = PlaceScreenParams & {
  onCloseRoute?: Parameters<
    DashboardScreenProps<'Dashboard_PlaceScreen'>['navigation']['popTo']
  >;
};

export type DashboardStackParams = StackParams<{
  Dashboard_RootScreen: DashboardRootScreenParams;
  Dashboard_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Dashboard_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Dashboard_PlaceScreen: Dashboard_PlaceScreenParams;
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
