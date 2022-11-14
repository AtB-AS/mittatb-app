import {TripPattern} from '@atb/api/types/trips';

import {Location} from '@atb/favorites/types';
import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DetailsStackParams} from '../TripDetails/types';
import {DateTimePickerParams, SearchTime} from './journey-date-picker';
import NearbyStopPlacesScreen, {
  NearbyStopPlacesScreenParams,
} from '@atb/screens/Dashboard/NearbyStopPlacesScreen';
import {PlaceScreenParams} from '@atb/screens/Departures/PlaceScreen';

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export type TripPatternWithKey = TripPattern & {key: string};
export type TripSearchParams = {
  fromLocation?: Location;
  toLocation?: Location;
  searchTime?: SearchTime;
  callerRouteName?: any;
};
export type DashboardRootParams = {} & TripSearchParams;

export type DashboardParams = {
  DashboardRoot: DashboardRootParams;
  TripSearch: TripSearchParams;
  TripDetails: NavigatorScreenParams<DetailsStackParams>;
  DateTimePicker: DateTimePickerParams;
  FavoriteDeparturesDashboardScreen: undefined;
  NearbyStopPlacesDashboardScreen: NearbyStopPlacesScreenParams;
  PlaceScreen: PlaceScreenParams;
};

export type RootDashboardScreenProps = TabNavigatorScreenProps<'Dashboard'>;

export type DashboardScreenProps<T extends keyof DashboardParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardParams, T>,
    RootDashboardScreenProps
  >;
