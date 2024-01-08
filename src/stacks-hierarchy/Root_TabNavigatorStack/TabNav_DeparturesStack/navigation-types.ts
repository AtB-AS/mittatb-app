import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {PlaceScreenParams} from '@atb/place-screen/PlaceScreenComponent';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {NearbyStopPlacesScreenParams} from '@atb/nearby-stop-places/NearbyStopPlacesScreenComponent';
import {ScreenParams} from "@atb/stacks-hierarchy/navigation-types";

export type DeparturesStackParams = {
  Departures_DepartureDetailsScreen: ScreenParams<DepartureDetailsScreenParams>;
  Departures_TravelDetailsMapScreen: ScreenParams<TravelDetailsMapScreenParams>;
  Departures_PlaceScreen: ScreenParams<PlaceScreenParams>;
  Departures_NearbyStopPlacesScreen: ScreenParams<NearbyStopPlacesScreenParams>;
};

export type RootDeparturesScreenProps =
  TabNavigatorScreenProps<'TabNav_DeparturesStack'>;

export type DeparturesStackProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    RootDeparturesScreenProps
  >;
