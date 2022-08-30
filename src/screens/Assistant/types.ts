import {TripPattern} from '@atb/api/types/trips';
import {Location} from '@atb/favorites/types';
import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DetailsRouteParams} from '../TripDetails/Details';
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
  TripDetails: DetailsRouteParams;
  DateTimePicker: DateTimePickerParams;
};

export type RootAssistantScreenProps = TabNavigatorScreenProps<'Assistant'>;

export type AssistantScreenProps<T extends keyof AssistantParams> =
  CompositeScreenProps<
    StackScreenProps<AssistantParams, T>,
    RootAssistantScreenProps
  >;
