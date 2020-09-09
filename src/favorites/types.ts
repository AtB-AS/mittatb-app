import {Feature} from '../sdk';
import {Coordinates} from '@entur/sdk';

export type Location = Feature['properties'] & {
  coordinates: Coordinates;
};

export type UserFavorites = LocationFavorite[];

export type LocationFavorite = {
  id: string;
  location: Location;
  emoji?: string;
  name?: string;
};
