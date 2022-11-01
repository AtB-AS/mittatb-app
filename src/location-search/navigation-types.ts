import {StackScreenProps} from '@react-navigation/stack';
import {ChipTypeGroup} from '@atb/favorite-chips';
import {Location} from '@atb/favorites/types';

type LocationSearchByTextScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
};

type LocationSearchByMapScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  initialLocation?: Location;
};

export type LocationSearchStackParams = {
  LocationSearchByTextScreen: LocationSearchByTextScreenParams;
  LocationSearchByMapScreen: LocationSearchByMapScreenParams;
};

export type LocationSearchStackScreenProps<
  T extends keyof LocationSearchStackParams,
> = StackScreenProps<LocationSearchStackParams, T>;
