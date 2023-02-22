import {ChipTypeGroup} from '@atb/favorite-chips';
import {Location} from '@atb/favorites/types';

export type Root_LocationSearchByTextScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
};
