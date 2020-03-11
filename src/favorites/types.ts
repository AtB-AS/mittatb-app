export type Location = {
  id: string;
  name: string;
  locality: string;
  label?: string;
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
