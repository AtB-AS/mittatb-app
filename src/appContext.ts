import {createContext} from 'react';

export type Location = {
  id: string;
  name: string;
  label: string;
  coordinates: {longitude: number; latitude: number};
};

export type UserLocations = {
  home: Location;
  work: Location;
};

export type AppContextOptions = {
  userLocations: UserLocations | null;
};

export default createContext<AppContextOptions>({
  userLocations: null,
});
