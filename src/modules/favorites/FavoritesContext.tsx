import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {departures, journeys, places, StoredType} from './storage';
import {
  FavoriteDeparture,
  FavoriteDepartureId,
  FavoriteJourney,
  LocationFavorite,
  StoredFavoriteDeparture,
  StoredLocationFavorite,
  UserFavoriteDepartures,
  UserFavoriteJourneys,
  UserFavorites,
} from './types';
import {refreshWidgets} from '@atb/modules/native-bridges';
import {destinationDisplaysAreEqual} from '@atb/utils/destination-displays-are-equal';
import {
  ItemWithDestinationDisplayMigrationPairType,
  getFavoriteDeparturesWithDestinationDisplay,
  getUniqueDestinationDisplayMigrationPairs,
  getUpToDateFavoriteDepartures,
} from './utils';

type FavoriteContextState = {
  favorites: UserFavorites;
  favoriteDepartures: UserFavoriteDepartures;
  favoriteJourneys: UserFavoriteJourneys;
  addFavoriteLocation(location: LocationFavorite): Promise<void>;
  removeFavoriteLocation(id: string): Promise<void>;
  setFavoriteDepartures(favorite: UserFavoriteDepartures): Promise<void>;
  potentiallyMigrateFavoriteDepartures(
    itemsWithDestinationDisplayMigrationPair?: ItemWithDestinationDisplayMigrationPairType[],
  ): Promise<void>;
  setDashboardFavorite(id: string, value: boolean): Promise<void>;
  updateFavoriteLocation(favorite: StoredLocationFavorite): Promise<void>;
  setFavoriteLocations(favorites: UserFavorites): Promise<void>;

  getFavoriteDeparture(
    favoriteDeparture: FavoriteDepartureId,
  ): StoredFavoriteDeparture | undefined;
  addFavoriteDeparture(favoriteDeparture: FavoriteDeparture): Promise<void>;
  removeFavoriteDeparture(id: string): Promise<void>;
  addFavoriteJourney(favoriteJourney: FavoriteJourney): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const FavoritesContextProvider = ({children}: Props) => {
  const [favorites, setFavoritesState] = useState<UserFavorites>([]);
  const [favoriteDepartures, setFavoriteDeparturesState] =
    useState<UserFavoriteDepartures>([]);
  const [favoriteJourneys, setFavoriteJourneysState] =
    useState<UserFavoriteJourneys>([]);

  async function populateFavorites() {
    const [favorites, favoriteDepartures] = await Promise.all([
      places.getFavorites(),
      departures.getFavorites(),
    ]);
    setFavoritesState(favorites ?? []);
    const {
      favoriteDeparturesWithDestinationDisplay,
      didMigrateFavoriteDeparture,
    } = getFavoriteDeparturesWithDestinationDisplay(favoriteDepartures);

    setFavoriteDeparturesState(favoriteDeparturesWithDestinationDisplay ?? []);
    didMigrateFavoriteDeparture &&
      departures.setFavorites(favoriteDeparturesWithDestinationDisplay ?? []);
  }

  useEffect(() => {
    populateFavorites();
  }, []);

  const potentiallyMigrateFavoriteDepartures = useCallback(
    async (
      itemsWithDestinationDisplayMigrationPair?: ItemWithDestinationDisplayMigrationPairType[],
    ) => {
      if (!itemsWithDestinationDisplayMigrationPair?.length) return;

      const destinationDisplayMigrationPairs =
        getUniqueDestinationDisplayMigrationPairs(
          itemsWithDestinationDisplayMigrationPair,
        );

      const {upToDateFavoriteDepartures, aFavoriteDepartureWasUpdated} =
        getUpToDateFavoriteDepartures(
          favoriteDepartures,
          destinationDisplayMigrationPairs,
        );

      if (aFavoriteDepartureWasUpdated) {
        setFavoriteDeparturesState(upToDateFavoriteDepartures);
        await departures.setFavorites(upToDateFavoriteDepartures);
        refreshWidgets();
      }
    },
    [favoriteDepartures],
  );

  const contextValue: FavoriteContextState = {
    favorites,
    favoriteDepartures,
    favoriteJourneys,
    async addFavoriteLocation(favorite: LocationFavorite) {
      const newFavorites = await places.addFavorite(favorite);
      setFavoritesState(newFavorites);
    },
    async removeFavoriteLocation(id: string) {
      const newFavorites = await places.removeFavorite(id);
      setFavoritesState(newFavorites);
    },
    async updateFavoriteLocation(favorite: StoredType<LocationFavorite>) {
      const newFavorites = await places.updateFavorite(favorite);
      setFavoritesState(newFavorites);
    },
    async setFavoriteLocations(favorites: StoredType<LocationFavorite>[]) {
      const newFavorites = await places.setFavorites(favorites);
      setFavoritesState(newFavorites);
    },
    /**
     * Add favorite departure. If adding a favorite for the complete line
     * number, the existing favorites for specific line names on that line
     * number on the same quay will be removed.
     */
    async addFavoriteDeparture(favoriteDeparture: FavoriteDeparture) {
      if (!favoriteDeparture.destinationDisplay) {
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
      refreshWidgets();
    },
    async removeFavoriteDeparture(id: string) {
      const favorites = await departures.removeFavorite(id);
      setFavoriteDeparturesState(favorites);
      refreshWidgets();
    },
    async setFavoriteDepartures(favorites: UserFavoriteDepartures) {
      setFavoriteDeparturesState(favorites);
      await departures.setFavorites(favorites);
      refreshWidgets();
    },
    potentiallyMigrateFavoriteDepartures,
    async setDashboardFavorite(id: string, value: boolean) {
      const updatedFavorites = favoriteDepartures.map((f) =>
        f.id == id ? {...f, visibleOnDashboard: value} : f,
      );
      await departures.setFavorites(updatedFavorites);
      setFavoriteDeparturesState(updatedFavorites);
    },
    getFavoriteDeparture(potential: FavoriteDepartureId) {
      return favoriteDepartures.find(function (favorite) {
        return (
          favorite.lineId == potential.lineId &&
          (!favorite.destinationDisplay ||
            destinationDisplaysAreEqual(
              favorite.destinationDisplay,
              potential.destinationDisplay,
            )) &&
          favorite.quayId == potential.quayId
        );
      });
    },
    async addFavoriteJourney(favoriteJourney: FavoriteJourney) {
      const newFavoriteJourneys = await journeys.addFavorite(favoriteJourney);
      setFavoriteJourneysState(newFavoriteJourneys);
    },
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      'useFavorites must be used within a FavoritesContextProvider',
    );
  }
  return context;
}
