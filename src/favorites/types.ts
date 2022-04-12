import {
  Coordinates,
  TransportMode,
  TransportSubmode,
  FeatureCategory,
} from '@entur/sdk';
import {StoredType} from './storage';

export type Location = {
  id: string;
  name: string;
  layer: 'venue' | 'address';
  coordinates: Coordinates;
  locality: string;
  category: FeatureCategory[];
  label?: string;
  postalcode?: string;
  tariff_zones?: string[];
} & (
  | {
      resultType: 'search' | 'geolocation';
    }
  | {resultType: 'favorite'; favoriteId: string}
);

export type LocationFavorite = {
  location: Location;
  emoji?: string;
  name?: string;
};

export type StoredLocationFavorite = StoredType<LocationFavorite>;
export type UserFavorites = StoredLocationFavorite[];

export type FavoriteDepartureId = {
  stopId: string;
  lineName?: string;
  lineId: string;
  quayId: string;
};

export type FavoriteDeparture = FavoriteDepartureId & {
  lineLineNumber?: string;
  lineTransportationMode?: TransportMode;
  lineTransportationSubMode?: TransportSubmode;
  quayName: string;
  quayPublicCode?: string;
};

export type StoredFavoriteDeparture = StoredType<FavoriteDeparture>;
export type UserFavoriteDepartures = StoredFavoriteDeparture[];
