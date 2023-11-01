import React, {createContext, useContext, useEffect, useState} from 'react';
import {departures, places, StoredType} from './storage';
import {
  FavoriteDeparture,
  FavoriteDepartureId,
  LocationFavorite,
  StoredFavoriteDeparture,
  StoredLocationFavorite,
  UserFavoriteDepartures,
  UserFavoriteDeparturesLegacy,
  UserFavorites,
} from './types';

import {RCTWidgetUpdater} from '../widget-updater';
import {
  destinationDisplaysAreEqual,
  getUpToDateFavoriteDepartures,
  mapLegacyLineNameToDestinationDisplay,
} from '@atb/travel-details-screens/utils';
import {StopPlaceGroup} from '@atb/api/departures/types';

type FavoriteContextState = {
  favorites: UserFavorites;
  favoriteDepartures: UserFavoriteDepartures;
  addFavoriteLocation(location: LocationFavorite): Promise<void>;
  removeFavoriteLocation(id: string): Promise<void>;
  setFavoriteDepartures(favorite: UserFavoriteDepartures): Promise<void>;
  migrateFavoriteDepartures(stopPlaceGroups: StopPlaceGroup[]): Promise<void>;
  setDashboardFavorite(id: string, value: boolean): Promise<void>;
  updateFavoriteLocation(favorite: StoredLocationFavorite): Promise<void>;
  setFavoriteLocations(favorites: UserFavorites): Promise<void>;

  getFavoriteDeparture(
    favoriteDeparture: FavoriteDepartureId,
  ): StoredFavoriteDeparture | undefined;
  addFavoriteDeparture(favoriteDeparture: FavoriteDeparture): Promise<void>;
  removeFavoriteDeparture(id: string): Promise<void>;
};
const FavoritesContext = createContext<FavoriteContextState | undefined>(
  undefined,
);

export const FavoritesContextProvider: React.FC = ({children}) => {
  const [favorites, setFavoritesState] = useState<UserFavorites>([]);
  const [favoriteDepartures, setFavoriteDeparturesState] =
    useState<UserFavoriteDepartures>([]);
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

  const contextValue: FavoriteContextState = {
    favorites,
    favoriteDepartures,
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
      RCTWidgetUpdater.refreshWidgets();
    },
    async removeFavoriteDeparture(id: string) {
      const favorites = await departures.removeFavorite(id);
      setFavoriteDeparturesState(favorites);
      RCTWidgetUpdater.refreshWidgets();
    },
    async setFavoriteDepartures(favorites: UserFavoriteDepartures) {
      setFavoriteDeparturesState(favorites);
      await departures.setFavorites(favorites);
      RCTWidgetUpdater.refreshWidgets();
    },
    async migrateFavoriteDepartures(stopPlaceGroups) {
      if (!stopPlaceGroups.length) return;

      const {upToDateFavoriteDepartures, aFavoriteDepartureWasUpdated} =
        getUpToDateFavoriteDepartures(favoriteDepartures, stopPlaceGroups);

      if (aFavoriteDepartureWasUpdated) {
        setFavoriteDeparturesState(upToDateFavoriteDepartures);
        await departures.setFavorites(upToDateFavoriteDepartures);
        RCTWidgetUpdater.refreshWidgets();
      }
    },
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
          favorite.stopId == potential.stopId &&
          favorite.quayId == potential.quayId
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

function getFavoriteDeparturesWithDestinationDisplay(
  favoriteDepartures: UserFavoriteDepartures | UserFavoriteDeparturesLegacy,
) {
  // app version 1.41 and earlier used lineName in favoriteDepartures
  // this function ensures all favoriteDepartures are migrated to using destinationDisplay instead
  let didMigrateFavoriteDeparture = false;
  const favoriteDeparturesWithDestinationDisplay = favoriteDepartures.map(
    (fd) => {
      if ('lineName' in fd) {
        didMigrateFavoriteDeparture = true;
        const {lineName, ...fdWithoutLineName} = fd;
        return {
          ...fdWithoutLineName,
          destinationDisplay: mapLegacyLineNameToDestinationDisplay(lineName),
        };
      } else {
        return fd;
      }
    },
  );
  return {
    favoriteDeparturesWithDestinationDisplay,
    didMigrateFavoriteDeparture,
  };
}
