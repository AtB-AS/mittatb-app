import React, {createContext, useContext, useEffect, useState} from 'react';
import {storedFilters} from './storage';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';

type FiltersContextState = {
  filters: TravelSearchFiltersSelectionType | undefined;
  setFilters(filters: TravelSearchFiltersSelectionType | undefined): void;
};

const FiltersContext = createContext<FiltersContextState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const FiltersContextProvider = ({children}: Props) => {
  const [filters, setFiltersState] =
    useState<TravelSearchFiltersSelectionType>();

  useEffect(() => {
    storedFilters
      .getFiltersAndMigrateFromV1IfNeeded()
      .then((filters) => setFiltersState(filters));
  }, []);

  const contextValue: FiltersContextState = {
    filters,
    async setFilters(filters: TravelSearchFiltersSelectionType) {
      const setFilters = await storedFilters.setFilters(filters);
      setFiltersState(setFilters);
    },
  };

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  );
};

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersContextProvider');
  }
  return context;
}
