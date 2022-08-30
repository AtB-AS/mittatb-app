import {RootNavigationProps} from '@atb/navigation/types';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {AssistantScreenProps} from '../Assistant/types';
import {DashboardScreenProps} from '../Dashboard/types';
import {PlaceScreenParams} from '../Departures/PlaceScreen';
import {DeparturesScreenProps} from '../Departures/types';
import {NearbyScreenProps} from '../Nearby/types';
import {DepartureDetailsRouteParams} from './DepartureDetails';
import {DetailsRouteParams} from './Details';
import {MapDetailRouteParams} from './Map';
import {QuayDeparturesRouteParams} from './QuayDepartures';

export type DetailsStackParams = {
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
  DetailsMap: MapDetailRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  PlaceScreen: PlaceScreenParams;
};

// Can be used several places. Each place should be a condition.
export type TripDetailsRootProps =
  | NearbyScreenProps<'TripDetails'>
  | AssistantScreenProps<'TripDetails'>
  | DashboardScreenProps<'TripDetails'>
  | DeparturesScreenProps<'TripDetails'>;

export type TripDetailsRootNavigation<T extends keyof DetailsStackParams> =
  CompositeNavigationProp<
    StackNavigationProp<DetailsStackParams, T>,
    RootNavigationProps
  >;

export type TripDetailsScreenProps<T extends keyof DetailsStackParams> =
  CompositeScreenProps<
    StackScreenProps<DetailsStackParams, T>,
    TripDetailsRootProps
  >;
