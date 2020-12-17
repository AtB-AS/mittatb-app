import {Location, StoredLocationFavorite} from '../favorites/types';

export type LocationSearchResult = {
  location: Location;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};
