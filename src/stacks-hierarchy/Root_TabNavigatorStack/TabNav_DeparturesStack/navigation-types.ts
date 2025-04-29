import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {PlaceScreenParams} from '@atb/screen-components/place-screen';
import {DepartureDetailsScreenParams} from '@atb/travel-details-screens/DepartureDetailsScreenComponent';
import {TravelDetailsMapScreenParams} from '@atb/screen-components/travel-details-map-screen';
import {NearbyStopPlacesScreenParams} from '@atb/screen-components/nearby-stop-places';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {TravelAidScreenParams} from '@atb/screen-components/travel-aid';

export type DeparturesStackParams = StackParams<{
  Departures_DepartureDetailsScreen: DepartureDetailsScreenParams;
  Departures_TravelDetailsMapScreen: TravelDetailsMapScreenParams;
  Departures_PlaceScreen: PlaceScreenParams;
  Departures_NearbyStopPlacesScreen: NearbyStopPlacesScreenParams;
  Departures_TravelAidScreen: TravelAidScreenParams;
}>;

export type RootDeparturesScreenProps =
  TabNavigatorScreenProps<'TabNav_DeparturesStack'>;

export type DeparturesStackProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    RootDeparturesScreenProps
  >;
