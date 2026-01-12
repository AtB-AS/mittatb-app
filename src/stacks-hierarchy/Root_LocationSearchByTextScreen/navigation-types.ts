import {ChipTypeGroup, Location} from '@atb/modules/favorites';
import {RootStackScreenProps} from '../navigation-types';
import {SelectableLocationType} from './types';

// Valid screens that can be navigated to from the location search by text screen
export type LocationSearchCallerRoute = Parameters<
  RootStackScreenProps<'Root_LocationSearchByTextScreen'>['navigation']['popTo']
>;

export const updateCallerRouteParams = (
  callerRoute: LocationSearchCallerRoute,
  callerRouteParam: string,
  location: Location | SelectableLocationType | undefined,
): LocationSearchCallerRoute => {
  const [screen, params, options] = callerRoute;
  if (params) {
    let nestedParam = params;
    while ('screen' in nestedParam) {
      if (!nestedParam.params) break; // found the deepest nested params, and therefore the one we need to update
      nestedParam = nestedParam.params;
    }

    // Using Object.assign to avoid type errors when updating the nested params
    Object.assign(nestedParam, {
      [callerRouteParam]: location,
    });
  }
  return [screen, params, options] as LocationSearchCallerRoute;
};

export type CallerRouteConfig = {
  route: LocationSearchCallerRoute;
  locationRouteParam: string;
};

export type Root_LocationSearchByTextScreenParams = {
  callerRouteConfig: CallerRouteConfig;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
  onlyStopPlacesCheckboxInitialState: boolean;
};
