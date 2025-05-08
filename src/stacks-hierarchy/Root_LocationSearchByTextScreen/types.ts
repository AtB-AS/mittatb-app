import {JourneySearchHistoryEntry} from '@atb/modules/search-history';
import {
  Location,
  SearchLocation,
  StoredLocationFavorite,
} from '@atb/modules/favorites';

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
