import React, {createContext, useContext, useEffect, useState} from 'react';
import {places, departures, StoredType} from './storage';
import {
  FavoriteDeparture,
  FavoriteDepartureId,
  LocationFavorite,
  StoredFavoriteDeparture,
  StoredLocationFavorite,
  UserFavoriteDepartures,
  UserFavorites,
} from './types';

type FavoriteContextState = {
  favorites: UserFavorites;
  favoriteDepartures: UserFavoriteDepartures;
  addFavoriteLocation(location: LocationFavorite): Promise<void>;
  removeFavoriteLocation(id: string): Promise<void>;
  updateFavoriteLocation(favorite: StoredLocationFavorite): Promise<void>;
  setFavoriteLocationss(favorites: UserFavorites): Promise<void>;

  getFavoriteDeparture(
    favoriteDeparture: FavoriteDepartureId,
  ): StoredFavoriteDeparture | undefined;
  addFavoriteDeparture(favoriteDeparture: FavoriteDeparture): Promise<void>;
  removeFavoriteDeparture(id: string): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

const FavoritesContextProvider: React.FC = ({children}) => {
  const [favorites, setFavoritesState] = useState<UserFavorites>([]);
  const [
    favoriteDepartures,
    setFavoriteDeparturesState,
  ] = useState<UserFavoriteDepartures>([]);
  async function populateFavorites() {
    const [favorites, favoriteDepartures] = await Promise.all([
      places.getFavorites(),
      departures.getFavorites(),
    ]);
    setFavoritesState(favorites ?? []);
    setFavoriteDeparturesState(favoriteDepartures ?? []);
  }

  useEffect(() => {
    populateFavorites();
  }, []);

  const contextValue: FavoriteContextState = {
    favorites,
    favoriteDepartures,
    async addFavoriteLocation(favorite: LocationFavorite) {
      const favorites = await places.addFavorite(favorite);
      setFavoritesState(favorites);
    },
    async removeFavoriteLocation(id: string) {
      const favorites = await places.removeFavorite(id);
      setFavoritesState(favorites);
    },
    async updateFavoriteLocation(favorite: StoredType<LocationFavorite>) {
      const favorites = await places.updateFavorite(favorite);
      setFavoritesState(favorites);
    },
    async setFavoriteLocationss(favorites: StoredType<LocationFavorite>[]) {
      const newFavorites = await places.setFavorites(favorites);
      setFavoritesState(newFavorites);
    },

    async addFavoriteDeparture(favoriteDeparture: FavoriteDeparture) {
      const favorites = await departures.addFavorite(favoriteDeparture);
      setFavoriteDeparturesState(favorites);
    },
    async removeFavoriteDeparture(id: string) {
      const favorites = await departures.removeFavorite(id);
      setFavoriteDeparturesState(favorites);
    },

    getFavoriteDeparture(potential: FavoriteDepartureId) {
      return favoriteDepartures.find(function (favorite) {
        return (
          favorite.lineId == potential.lineId &&
          favorite.lineName == potential.lineName &&
          favorite.stopId == potential.stopId
        );
      });
    },
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      'useFavorites must be used within a FavoritesContextProvider',
    );
  }
  return context;
}

export default FavoritesContextProvider;
