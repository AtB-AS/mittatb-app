import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {TripDetailsScreenParams} from '@atb/travel-details-screens/TripDetailsScreenComponent';
import {JourneyDatePickerScreenParams} from '@atb/journey-date-picker';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TripSearchScreenParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

type Dashboard_NearbyStopPlacesScreenParams = NearbyStopPlacesScreenParams & {
  onCloseRoute: keyof DashboardStackParams;
};

type Dashboard_PlaceScreenParams = PlaceScreenParams & {
  onCloseRoute?: keyof DashboardStackParams;
};

export type DashboardStackParams = StackParams<{
  Dashboard_RootScreen: DashboardRootScreenParams;
  Dashboard_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Dashboard_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Dashboard_PlaceScreen: Dashboard_PlaceScreenParams;
  Dashboard_TripSearchScreen: TripSearchScreenParams;
  Dashboard_TripDetailsScreen: TripDetailsScreenParams;
  Dashboard_JourneyDatePickerScreen: JourneyDatePickerScreenParams;
  Dashboard_FavoriteDeparturesScreen: undefined;
  Dashboard_NearbyStopPlacesScreen: Dashboard_NearbyStopPlacesScreenParams;
}>;

export type RootDashboardScreenProps =
  TabNavigatorScreenProps<'TabNav_DashboardStack'>;

export type DashboardScreenProps<T extends keyof DashboardStackParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardStackParams, T>,
    RootDashboardScreenProps
  >;
