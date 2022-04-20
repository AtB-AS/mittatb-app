import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {
  Location,
  SearchLocation,
  StoredLocationFavorite,
} from '../favorites/types';

export type LocationSearchResult = {
  location: SearchLocation;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};

export type SelectableLocationData =
  | Location
  | {
      resultType: 'journey';
      journeyData: JourneySearchHistoryEntry;
    };
