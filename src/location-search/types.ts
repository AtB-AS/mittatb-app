import {Location, LocationFavorite} from '../favorites/types';

export type LocationSearchResult = {
  location: Location;
  favoriteInfo?: Omit<LocationFavorite, 'location'>;
};
