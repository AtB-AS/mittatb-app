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
  const paramsCopy = params ? cloneNestedParams(params) : params;

  if (paramsCopy) {
    let nestedParam: any = paramsCopy;
    while (
      nestedParam &&
      typeof nestedParam === 'object' &&
      'screen' in nestedParam
    ) {
      if (!nestedParam.params) break;
      nestedParam = nestedParam.params;
    }

    // Using Object.assign to avoid type errors when updating the nested params
    Object.assign(nestedParam, {
      [callerRouteParam]: location,
    });
  }

  return [screen, paramsCopy, options] as LocationSearchCallerRoute;
};

function cloneNestedParams<T>(params: T): T {
  if (!params || typeof params !== 'object') return params;
  const copy: any = Array.isArray(params) ? [...params] : {...params};
  if (copy.params) {
    copy.params = cloneNestedParams(copy.params);
  }
  return copy;
}

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
