import {JourneySearchHistoryEntry} from '@atb/search-history';
import {
  Location,
  SearchLocation,
  StoredLocationFavorite,
} from '../favorites/types';

export type LocationSearchResultType = {
  location: SearchLocation;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};

export type SelectableLocationType =
  | Location
  | {
      resultType: 'journey';
      journeyData: JourneySearchHistoryEntry;
    };
