import {Location} from '@atb/favorites/types';
import {TabNavigatorScreenProps} from '@atb/navigation/types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {DetailsStackParams} from '../TripDetails/types';

type NearbyRouteName = 'NearbyRoot';
export const NearbyRouteNameStatic: NearbyRouteName = 'NearbyRoot';

export const DateOptions = ['now', 'departure'] as const;
export type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

export type NearbyStackParams = {
  [NearbyRouteNameStatic]: NearbyScreenParams;
  TripDetails: NavigatorScreenParams<DetailsStackParams>;
};

export type RootNearbyScreenProps = TabNavigatorScreenProps<'Nearest'>;

export type NearbyScreenProps<T extends keyof NearbyStackParams> =
  CompositeScreenProps<
    StackScreenProps<NearbyStackParams, T>,
    TabNavigatorScreenProps<'Nearest'>
  >;

export type NearbyScreenParams = {
  location: Location;
};
