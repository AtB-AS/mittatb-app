import {Location} from '@atb/favorites';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {QuayDeparturesScreenParams} from '@atb/quay-departures-screen';

export type NearbyStackParams = {
  Nearby_RootScreen: NearbyScreenParams;
  Nearby_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Nearby_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Nearby_QuayDeparturesScreen: QuayDeparturesScreenParams;
};

export type RootNearbyScreenProps =
  TabNavigatorScreenProps<'TabNav_NearestStack'>;

export type NearbyScreenProps<T extends keyof NearbyStackParams> =
  CompositeScreenProps<
    StackScreenProps<NearbyStackParams, T>,
    TabNavigatorScreenProps<'TabNav_NearestStack'>
  >;

export type NearbyScreenParams = {
  location: Location;
};
