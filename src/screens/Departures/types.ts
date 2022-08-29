import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DetailsStackParams} from '../TripDetails';
import {DepartureDetailsRouteParams} from '../TripDetails/DepartureDetails';
import {MapDetailRouteParams} from '../TripDetails/Map';
import {QuayDeparturesRouteParams} from '../TripDetails/QuayDepartures';
import {AllStopsOverviewParams} from './AllStopsOverview';
import {PlaceScreenParams} from './PlaceScreen';

export type DeparturesStackParams = {
  DeparturesRoot: undefined;
  AllStopsOverview: AllStopsOverviewParams;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
};

export type RootDeparturesScreenProps = TabNavigatorScreenProps<'Nearest'>;

export type DeparturesScreenProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    TabNavigatorScreenProps<'Nearest'>
  >;
