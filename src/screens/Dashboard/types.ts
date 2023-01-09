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
import {NearbyStopPlacesScreenParams} from '@atb/screens/Dashboard/NearbyStopPlacesScreen';
import {PlaceScreenParams} from '@atb/screens/Departures/PlaceScreen';
import {TransportModes} from '@atb/api/types/generated/journey_planner_v3_types';
import {LanguageAndTextType} from '@atb/translations';

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
  callerRoute?: {name: string};
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
  TravelSearchFilterOnboardingScreen: undefined;
};

export type RootDashboardScreenProps = TabNavigatorScreenProps<'Dashboard'>;

export type DashboardScreenProps<T extends keyof DashboardParams> =
  CompositeScreenProps<
    StackScreenProps<DashboardParams, T>,
    RootDashboardScreenProps
  >;

export type TransportIconModeType = Omit<
  TransportModes,
  'transportSubModes'
> & {
  transportSubMode?: Required<TransportModes>['transportSubModes'][0];
};

export type TransportModeFilterOptionType = {
  id: string;
  icon: TransportIconModeType;
  text: LanguageAndTextType[];
  description?: LanguageAndTextType[];
  modes: TransportModes[];
};

export type TravelSearchFiltersType = {
  transportModes?: TransportModeFilterOptionType[];
};
