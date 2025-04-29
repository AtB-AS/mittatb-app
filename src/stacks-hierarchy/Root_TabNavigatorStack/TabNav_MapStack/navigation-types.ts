import {PlaceScreenParams} from '@atb/screen-components/place-screen';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DashboardScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {MapScreenParams} from './Map_RootScreen';
import {TravelAidScreenParams} from '@atb/screen-components/travel-aid';

export type MapStackParams = StackParams<{
  Map_RootScreen: MapScreenParams;
  Map_PlaceScreen: PlaceScreenParams;
  Map_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Map_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Map_TravelAidScreen: TravelAidScreenParams;
}>;

type RootMapScreenProps = TabNavigatorScreenProps<'TabNav_MapStack'>;
export type MapScreenProps<T extends keyof MapStackParams> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<MapStackParams, T>,
      RootMapScreenProps
    >,
    DashboardScreenProps<'Dashboard_TripSearchScreen'>
  >;
