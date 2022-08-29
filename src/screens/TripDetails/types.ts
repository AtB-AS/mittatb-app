import {RootProps} from '@atb/navigation/types';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {PlaceScreenParams} from '../Departures/PlaceScreen';
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

export type TripDetailsRootProps = NearbyScreenProps<'TripDetails'>;

export type TripDetailsRootNavigation<T extends keyof DetailsStackParams> =
  CompositeNavigationProp<
    StackNavigationProp<DetailsStackParams, T>,
    RootProps
  >;

export type TripDetailsScreenProps<T extends keyof DetailsStackParams> =
  CompositeScreenProps<
    StackScreenProps<DetailsStackParams, T>,
    TripDetailsRootProps
  >;
