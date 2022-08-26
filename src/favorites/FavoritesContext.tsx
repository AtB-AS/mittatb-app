import React, {createContext, useContext, useEffect, useState} from 'react';
import {places, departures, StoredType, frontpageFavourites} from './storage';
import {
  FavoriteDeparture,
  FavoriteDepartureId,
  FavoriteDepartureWithId,
  LocationFavorite,
  StoredFavoriteDeparture,
  StoredLocationFavorite,
  UserFavoriteDepartures,
  UserFavorites,
} from './types';

type FavoriteContextState = {
  favorites: UserFavorites;
  favoriteDepartures: UserFavoriteDepartures;
  frontPageFavouriteDepartures: UserFavoriteDepartures;
  addFavoriteLocation(location: LocationFavorite): Promise<void>;
  removeFavoriteLocation(id: string): Promise<void>;
  updateFavoriteLocation(favorite: StoredLocationFavorite): Promise<void>;
  setFavoriteLocationss(favorites: UserFavorites): Promise<void>;

  getFavoriteDeparture(
    favoriteDeparture: FavoriteDepartureId,
  ): StoredFavoriteDeparture | undefined;
  addFavoriteDeparture(favoriteDeparture: FavoriteDeparture): Promise<void>;
  removeFavoriteDeparture(id: string): Promise<void>;

  addFrontPageFavouriteDeparture(
    favoriteDeparture: FavoriteDeparture,
  ): Promise<void>;
  removeFrontPageFavouriteDeparture(
    favouriteDepartureId: FavoriteDepartureId,
  ): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

const FavoritesContextProvider: React.FC = ({children}) => {
  const [favorites, setFavoritesState] = useState<UserFavorites>([]);
  const [favoriteDepartures, setFavoriteDeparturesState] =
    useState<UserFavoriteDepartures>([]);
  const [frontPageFavouriteDepartures, setFrontPageFavouriteDepartures] =
    useState<UserFavoriteDepartures>([]);
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
    frontPageFavouriteDepartures,
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

    /**
     * Add favorite departure. If adding a favorite for the complete line
     * number, the existing favorites for specific line names on that line
     * number on the same quay will be removed.
     */
    async addFavoriteDeparture(favoriteDeparture: FavoriteDeparture) {
      if (!favoriteDeparture.lineName) {
        const favoritesExisting = await departures.getFavorites();
        const favoritesFiltered = favoritesExisting.filter(
          (f) =>
            f.lineId !== favoriteDeparture.lineId ||
            f.quayId !== favoriteDeparture.quayId,
        );
        await departures.setFavorites(favoritesFiltered);
      }
      const favoritesUpdated = await departures.addFavorite(favoriteDeparture);
      setFavoriteDeparturesState(favoritesUpdated);
    },
    async removeFavoriteDeparture(id: string) {
      const favorites = await departures.removeFavorite(id);
      setFavoriteDeparturesState(favorites);
    },
    getFavoriteDeparture(potential: FavoriteDepartureId) {
      return favoriteDepartures.find(function (favorite) {
        return (
          favorite.lineId == potential.lineId &&
          (!favorite.lineName || favorite.lineName == potential.lineName) &&
          favorite.stopId == potential.stopId &&
          favorite.quayId == potential.quayId
        );
      });
    },

    async addFrontPageFavouriteDeparture(
      favoriteDeparture: FavoriteDepartureWithId,
    ) {
      const frontPageFavouriteDepartures =
        await frontpageFavourites.addFrontpageFavourite(favoriteDeparture);
      setFrontPageFavouriteDepartures(frontPageFavouriteDepartures);
    },

    async removeFrontPageFavouriteDeparture(
      favouriteDeparture: FavoriteDepartureWithId,
    ) {
      const favourites = await frontpageFavourites.removeFrontpageFavorite(
        favouriteDeparture.id,
      );
      setFrontPageFavouriteDepartures(favourites);
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
