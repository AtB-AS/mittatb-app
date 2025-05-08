import {ChipTypeGroup, Location} from '@atb/modules/favorites';

export type Root_LocationSearchByTextScreenParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
  onlyStopPlacesCheckboxInitialState: boolean;
};
