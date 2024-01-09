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
import {ScreenParams} from '@atb/stacks-hierarchy/navigation-types';

export type DashboardRootScreenParams = {} & TripSearchScreenParams;

type Dashboard_NearbyStopPlacesScreenParams = NearbyStopPlacesScreenParams & {
  onCloseRoute: keyof DashboardStackParams;
};

type Dashboard_PlaceScreenParams = PlaceScreenParams & {
  onCloseRoute?: keyof DashboardStackParams;
};

export type DashboardStackParams = {
  Dashboard_RootScreen: ScreenParams<DashboardRootScreenParams>;
  Dashboard_DepartureDetailsScreen: ScreenParams<DepartureDetailsScreenParams>;
  Dashboard_TravelDetailsMapScreen: ScreenParams<TravelDetailsMapScreenParams>;
  Dashboard_PlaceScreen: ScreenParams<Dashboard_PlaceScreenParams>;
  Dashboard_TripSearchScreen: ScreenParams<TripSearchScreenParams>;
  Dashboard_TripDetailsScreen: ScreenParams<TripDetailsScreenParams>;
  Dashboard_JourneyDatePickerScreen: ScreenParams<JourneyDatePickerScreenParams>;
  Dashboard_FavoriteDeparturesScreen: ScreenParams<undefined>;
  Dashboard_NearbyStopPlacesScreen: ScreenParams<Dashboard_NearbyStopPlacesScreenParams>;
};

export type RootDashboardScreenProps =
  TabNavigatorScreenProps<'TabNav_DashboardStack'>;

export type DashboardScreenProps<T extends keyof DashboardStackParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardStackParams, T>,
    RootDashboardScreenProps
  >;
