import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
} from './storage';
import {UserFavorites, LocationFavorite} from './types';

type FavoriteContextState = {
  favorites: UserFavorites;
  addFavorite(location: LocationFavorite): Promise<void>;
  removeFavorite(location: LocationFavorite): Promise<void>;
  updateFavorite(
    newLocation: LocationFavorite,
    existingLocation: LocationFavorite,
  ): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

const FavoritesContextProvider: React.FC = ({children}) => {
  const [favorites, setFavorites] = useState<UserFavorites>([]);
  async function populateFavorites() {
    const favorites = await getFavorites();
    setFavorites(favorites ?? []);
  }

  useEffect(() => {
    populateFavorites();
  }, []);

  const contextValue: FavoriteContextState = {
    favorites,
    async addFavorite(location: LocationFavorite) {
      const favorites = await addFavorite(location);
      setFavorites(favorites);
    },
    async removeFavorite(location: LocationFavorite) {
      const favorites = await removeFavorite(location);
      setFavorites(favorites);
    },
    async updateFavorite(
      newLocation: LocationFavorite,
      existingLocation: LocationFavorite,
    ) {
      const favorites = await updateFavorite(newLocation, existingLocation);
      setFavorites(favorites);
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
