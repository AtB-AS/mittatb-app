import {ChipTypeGroup, Location} from '@atb/modules/favorites';

export type Root_LocationSearchByTextScreenParams = {
  /** See `usePendingLocationSearchStore` */
  resultKey: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
  onlyStopPlacesCheckboxInitialState: boolean;
};
