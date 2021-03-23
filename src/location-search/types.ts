import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {
  Location,
  LocationWithMetadata,
  StoredLocationFavorite,
} from '../favorites/types';

export type LocationSearchResult = {
  location: Location;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};

export type SelectableLocationData =
  | LocationWithMetadata
  | {
      resultType: 'journey';
      journeyData: JourneySearchHistoryEntry;
    };
