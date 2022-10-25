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
import {NearbyDeparturesScreenParams} from '@atb/screens/Dashboard/NearbyDeparturesScreen';
import {PlaceScreenParams} from '@atb/screens/Departures/PlaceScreen';
import {NearbyLinesScreenParams} from '@atb/screens/Dashboard/NearbyLinesScreen';

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export type TripPatternWithKey = TripPattern & {key: string};

export type DashboardParams = {
  DashboardRoot: {
    fromLocation: Location | undefined;
    toLocation: Location | undefined;
    searchTime: SearchTime | undefined;
  };
  TripSearch: {
    fromLocation: Location;
    toLocation: Location;
    searchTime: SearchTime | undefined;
  };

  TripDetails: NavigatorScreenParams<DetailsStackParams>;
  DateTimePicker: DateTimePickerParams;
  NearbyDeparturesScreen: NearbyDeparturesScreenParams;
  PlaceScreen: PlaceScreenParams;
  NearbyLinesScreen: NearbyLinesScreenParams;
  FavoriteDepartures: undefined
};

export type RootDashboardScreenProps = TabNavigatorScreenProps<'Assistant'>;

export type DashboardScreenProps<T extends keyof DashboardParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardParams, T>,
    RootDashboardScreenProps
  >;
