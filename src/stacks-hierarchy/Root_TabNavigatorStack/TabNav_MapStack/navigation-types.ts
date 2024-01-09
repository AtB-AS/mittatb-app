import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {ScreenParams} from '@atb/stacks-hierarchy/navigation-types';

export type MapStackParams = {
  Map_RootScreen: ScreenParams<undefined>;
  Map_PlaceScreen: ScreenParams<PlaceScreenParams>;
  Map_DepartureDetailsScreen: ScreenParams<DepartureDetailsScreenParams>;
  Map_TravelDetailsMapScreen: ScreenParams<TravelDetailsMapScreenParams>;
};

type RootMapScreenProps = TabNavigatorScreenProps<'TabNav_MapStack'>;
export type MapScreenProps<T extends keyof MapStackParams> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<MapStackParams, T>,
      RootMapScreenProps
    >,
    DashboardScreenProps<'Dashboard_TripSearchScreen'>
  >;
