import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {Location, StoredLocationFavorite} from '../favorites/types';

export type LocationSearchResult = {
  location: Location;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};

export type SelectableLocationData =
  | Location
  | {
      resultType: 'journey';
      journeyData: JourneySearchHistoryEntry;
    };
