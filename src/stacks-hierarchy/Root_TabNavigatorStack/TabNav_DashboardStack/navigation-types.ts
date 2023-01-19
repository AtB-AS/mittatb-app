import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {TripDetailsScreenParams} from '@atb/travel-details-screens/TripDetailsScreenComponent';
import {QuayDeparturesScreenParams} from '@atb/quay-departures-screen';
import {JourneyDatePickerScreenParams} from '@atb/journey-date-picker';
import {NearbyStopPlacesScreenParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_NearbyStopPlacesScreen';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {TripSearchScreenParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

export type DashboardStackParams = {
  Dashboard_RootScreen: DashboardRootScreenParams;
  Dashboard_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Dashboard_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Dashboard_PlaceScreen: PlaceScreenParams;
  Dashboard_TripSearchScreen: TripSearchScreenParams;
  Dashboard_TripDetailsScreen: TripDetailsScreenParams;
  Dashboard_QuayDeparturesScreen: QuayDeparturesScreenParams;
  Dashboard_JourneyDatePickerScreen: JourneyDatePickerScreenParams;
  Dashboard_FavoriteDeparturesScreen: undefined;
  Dashboard_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
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
