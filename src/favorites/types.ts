import {Feature} from '../sdk';
import {Coordinates, TransportMode, TransportSubmode} from '@entur/sdk';
import {StoredType} from './storage';

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

export type FavoriteDepartureId = {
  stopId: string;
  lineName: string;
  lineId: string;
};

export type FavoriteDeparture = FavoriteDepartureId & {
  lineLineNumber?: string;
  lineTransportationMode?: TransportMode;
  lineTransportationSubMode?: TransportSubmode;
  quayName: string;
  quayId: string;
  quayPublicCode?: string;
};

export type StoredFavoriteDeparture = StoredType<FavoriteDeparture>;
export type UserFavoriteDepartures = StoredFavoriteDeparture[];
