import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {QuayDeparturesScreenParams} from '@atb/quay-departures-screen';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';

export type MapStackParams = {
  Map_RootScreen: undefined;
  Map_PlaceScreen: PlaceScreenParams;
  Map_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Map_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Map_QuayDeparturesScreen: QuayDeparturesScreenParams;
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
