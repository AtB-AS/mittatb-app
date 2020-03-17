import {Feature} from '../sdk';

export type Location = Feature['properties'] & {
  coordinates: {longitude: number; latitude: number};
};

export type UserLocations = {
  home: Location;
  work: Location;
};

export type UserFavorites = LocationFavorite[];

export type LocationFavorite = {
  location: Location;
  emoji?: string;
  name?: string;
};
