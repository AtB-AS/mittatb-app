import {Location} from '../favorites/types';

export type SearchHistoryLocation = Location;
export type SearchHistoryJourney = {from: Location; to: Location};
export type SearchHistory = {
  locations: SearchHistoryLocation[];
  journeys: SearchHistoryJourney[];
};
