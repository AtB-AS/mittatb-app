import {Feature} from '../sdk';

export type Location = Feature['properties'] & {
  coordinates: {longitude: number; latitude: number};
};

export type UserFavorites = LocationFavorite[];

export type LocationFavorite = {
  id: string;
  location: Location;
  emoji?: string;
  name?: string;
};
