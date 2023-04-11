import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';

export type DeparturesStackParams = {
  Departures_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Departures_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Departures_PlaceScreen: PlaceScreenParams;
  Departures_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
};

export type RootDeparturesScreenProps =
  TabNavigatorScreenProps<'TabNav_NearestStack'>;

export type DeparturesStackProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    RootDeparturesScreenProps
  >;
