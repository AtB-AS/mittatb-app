import {Coordinates, FavoriteDeparture, Feature} from '../sdk';
import {StoredType} from './storage';

export type {FavoriteDeparture, FavoriteDepartureId} from '../sdk';

export type Location = Feature['properties'] & {
  coordinates: Coordinates;
};

export type LocationFavorite = {
  location: Location;
  emoji?: string;
  name?: string;
};

export type StoredLocationFavorite = StoredType<LocationFavorite>;
export type UserFavorites = StoredLocationFavorite[];

export type LocationWithMetadata = Location &
  (
    | {
        resultType: 'search' | 'geolocation';
      }
    | {resultType: 'favorite'; favoriteId: string}
  );

export type StoredFavoriteDeparture = StoredType<FavoriteDeparture>;
export type UserFavoriteDepartures = StoredFavoriteDeparture[];
