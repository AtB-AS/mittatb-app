import {Coordinates, FeatureCategory} from '@atb/sdk';
import {StoredType} from './storage';
import {
  DestinationDisplay,
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

export type ChipTypeGroup = 'location' | 'map' | 'favorites' | 'add-favorite';

export type StoredLocationFavorite = StoredType<LocationFavorite>;
export type UserFavorites = StoredLocationFavorite[];

type FavoriteDepartureBaseIds = {
  stopId: string;
  lineId: string;
  quayId: string;
};

export type FavoriteDepartureIdLegacy = FavoriteDepartureBaseIds & {
  lineName?: string;
};

export type FavoriteDepartureId = FavoriteDepartureBaseIds & {
  destinationDisplay?: DestinationDisplay;
};

type FavoriteDepartureWithoutId = {
  lineLineNumber?: string;
  lineTransportationMode?: TransportMode;
  lineTransportationSubMode?: TransportSubmode;
  quayName: string;
  quayPublicCode?: string;
  visibleOnDashboard?: boolean;
};

export type FavoriteDeparture = FavoriteDepartureId &
  FavoriteDepartureWithoutId;
export type StoredFavoriteDeparture = StoredType<FavoriteDeparture>;
export type UserFavoriteDepartures = StoredFavoriteDeparture[];

type FavoriteDepartureLegacy = FavoriteDepartureIdLegacy &
  FavoriteDepartureWithoutId;
type StoredFavoriteDepartureLegacy = StoredType<FavoriteDepartureLegacy>;
export type UserFavoriteDeparturesLegacy = StoredFavoriteDepartureLegacy[];
