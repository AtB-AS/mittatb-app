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
  addFavorite(location: Omit<LocationFavorite, 'id'>): Promise<void>;
  removeFavorite(id: string): Promise<void>;
  updateFavorite(favorite: LocationFavorite): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

const FavoritesContextProvider: React.FC = ({children}) => {
  const [favorites, setFavorites] = useState<UserFavorites>([]);
  async function populateFavorites() {
    let favorites = await getFavorites();
    setFavorites(favorites ?? []);
  }

  useEffect(() => {
    populateFavorites();
  }, []);

  const contextValue: FavoriteContextState = {
    favorites,
    async addFavorite(favorite: Omit<LocationFavorite, 'id'>) {
      const favorites = await addFavorite(favorite);
      setFavorites(favorites);
    },
    async removeFavorite(id: string) {
      const favorites = await removeFavorite(id);
      setFavorites(favorites);
    },
    async updateFavorite(favorite: LocationFavorite) {
      const favorites = await updateFavorite(favorite);
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
