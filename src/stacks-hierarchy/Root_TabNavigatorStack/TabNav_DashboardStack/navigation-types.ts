import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {TripDetailsScreenParams} from '@atb/travel-details-screens/TripDetailsScreenComponent';
import {QuayDeparturesScreenParams} from '@atb/quay-departures-screen';
import {JourneyDatePickerScreenParams} from '@atb/journey-date-picker';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {TripSearchScreenParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

type Dashboard_NearbyStopPlacesScreenParams = NearbyStopPlacesScreenParams & {
  onCloseRoute: keyof DashboardStackParams;
};

type Dashboard_PlaceScreenParams = PlaceScreenParams & {
  onCloseRoute?: keyof DashboardStackParams;
};

export type DashboardStackParams = {
  Dashboard_RootScreen: DashboardRootScreenParams;
  Dashboard_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Dashboard_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Dashboard_PlaceScreen: Dashboard_PlaceScreenParams;
  Dashboard_TripSearchScreen: TripSearchScreenParams;
  Dashboard_TripDetailsScreen: TripDetailsScreenParams;
  Dashboard_QuayDeparturesScreen: QuayDeparturesScreenParams;
  Dashboard_JourneyDatePickerScreen: JourneyDatePickerScreenParams;
  Dashboard_FavoriteDeparturesScreen: undefined;
  Dashboard_NearbyStopPlacesScreen: Dashboard_NearbyStopPlacesScreenParams;
  Dashboard_TravelSearchFilterOnboardingScreen: undefined;
};

export type RootDashboardScreenProps =
  TabNavigatorScreenProps<'TabNav_DashboardStack'>;

export type DashboardScreenProps<T extends keyof DashboardStackParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardStackParams, T>,
    RootDashboardScreenProps
  >;

export type DashboardRootNavigation<T extends keyof DashboardStackParams> =
  CompositeNavigationProp<
    StackNavigationProp<DashboardStackParams, T>,
    RootNavigationProps
  >;
