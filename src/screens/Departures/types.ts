import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DepartureDetailsRouteParams} from '../TripDetails/DepartureDetails';
import {MapDetailRouteParams} from '../TripDetails/Map';
import {QuayDeparturesRouteParams} from '../TripDetails/QuayDepartures';
import {DetailsStackParams} from '../TripDetails/types';
import {AllStopsOverview, AllStopsOverviewParams} from './AllStopsOverview';
import {PlaceScreenParams} from './PlaceScreen';

export type DeparturesStackParams = {
  DeparturesRoot: undefined;
  PlaceScreen: PlaceScreenParams;
  DepartureDetails: DepartureDetailsRouteParams;
  QuayDepartures: QuayDeparturesRouteParams;
  TripDetails: DetailsStackParams;
  DetailsMap: MapDetailRouteParams;
  AllStopsOverview: AllStopsOverviewParams
};

export type RootDeparturesScreenProps = TabNavigatorScreenProps<'Nearest'>;

export type DeparturesScreenProps<T extends keyof DeparturesStackParams> =
  CompositeScreenProps<
    StackScreenProps<DeparturesStackParams, T>,
    RootDeparturesScreenProps
  >;

export type NearbyPlacesScreenTabParams = {
  AllStopsOverview: AllStopsOverviewParams;
  FavouriteStopsOverview: undefined;
};

export type RootNearbyPlacesScreenTabProps =
  DeparturesScreenProps<'DeparturesRoot'>;

export type NearbyPlacesScreenTabProps<
  T extends keyof NearbyPlacesScreenTabParams,
> = CompositeScreenProps<
  StackScreenProps<NearbyPlacesScreenTabParams, T>,
  RootNearbyPlacesScreenTabProps
>;
