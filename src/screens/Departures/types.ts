import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DepartureDetailsRouteParams} from '../TripDetails/DepartureDetails';
import {MapDetailRouteParams} from '../TripDetails/Map';
import {QuayDeparturesRouteParams} from '../TripDetails/QuayDepartures';
import {DetailsStackParams} from '../TripDetails/types';
import {PlaceScreenParams} from './PlaceScreen';
import {DeparturesScreenParams} from '@atb/screens/Departures/DeparturesScreen';

export type DeparturesStackParams = {
  DeparturesRoot: undefined;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
  DeparturesScreen: DeparturesScreenParams;
  DeparturesOnboardingScreen: undefined;
};

export type RootDeparturesScreenProps = TabNavigatorScreenProps<'Nearest'>;

export type DeparturesStackProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    RootDeparturesScreenProps
  >;
export type StopPlacesMode = 'Favourite' | 'Departure' | 'Map';
