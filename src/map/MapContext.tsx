import React, {createContext, useContext, useEffect, useState} from 'react';
import {storedFilters} from './storage';
import {TravelSearchFiltersSelectionType} from '@atb/map';

type MapContextState = {
  filters: TravelSearchFiltersSelectionType | undefined;
  setFilters(filters: TravelSearchFiltersSelectionType | undefined): void;
};

const MapContext = createContext<MapContextState | undefined>(undefined);

export const MapContextProvider: React.FC = ({children}) => {
  const [filters, setFiltersState] =
    useState<TravelSearchFiltersSelectionType>();

  useEffect(() => {
    storedFilters
      .getFiltersAndMigrateFromV1IfNeeded()
      .then((filters) => setFiltersState(filters));
  }, []);

  const contextValue: MapContextState = {
    filters,
    async setFilters(filters: TravelSearchFiltersSelectionType) {
      const setFilters = await storedFilters.setFilters(filters);
      setFiltersState(setFilters);
    },
  };

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapContextProvider');
  }
  return context;
}
