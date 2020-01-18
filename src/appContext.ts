import {createContext} from 'react';

export type Location = {
  coordinates: [number, number];
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
