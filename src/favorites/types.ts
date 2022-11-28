import {Coordinates, FeatureCategory} from '@entur/sdk';
import {StoredType} from './storage';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type GeoLocation = {
  id: string;
  name: string;
  coordinates: Coordinates;
  resultType: 'geolocation';
};

export type SearchLocation = {
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
  | {resultType: 'search'}
  | {
      resultType: 'favorite';
      favoriteId: string;
    }
);

export type Location = GeoLocation | SearchLocation;

export type LocationFavorite = {
  location: SearchLocation;
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
  visibleOnDashboard?: boolean;
};

export type FavoriteDepartureWithId = FavoriteDeparture & {
  id: string;
};

export type StoredFavoriteDeparture = StoredType<FavoriteDeparture>;
export type UserFavoriteDepartures = StoredFavoriteDeparture[];
