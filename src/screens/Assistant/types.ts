import {TripPattern} from '@atb/api/types/trips';
import {Location} from '@atb/favorites/types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootDashboardScreenProps} from '../Dashboard/types';
import {DetailsStackParams} from '../TripDetails/types';
import {DateTimePickerParams, SearchTime} from './journey-date-picker';

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export type TripPatternWithKey = TripPattern & {key: string};

export type AssistantParams = {
  AssistantRoot: {
    fromLocation: Location;
    toLocation: Location;
    searchTime: SearchTime;
  };
  TripDetails: NavigatorScreenParams<DetailsStackParams>;
  DateTimePicker: DateTimePickerParams;
};

export type AssistantScreenProps<T extends keyof AssistantParams> =
  CompositeScreenProps<
    StackScreenProps<AssistantParams, T>,
    RootDashboardScreenProps
  >;
