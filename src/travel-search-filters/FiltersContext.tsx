import React, {createContext, useContext, useEffect, useState} from 'react';
import {storedFilters} from './storage';
import {
  TravelSearchFilterOptionWithHitsType,
  TravelSearchFiltersSelectionType,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {storedFilterHits} from './filter-hits-storage';

type FiltersContextState = {
  filters: TravelSearchFiltersSelectionType | undefined;
  setFilters(filters: TravelSearchFiltersSelectionType | undefined): void;
  filterHits: TravelSearchFilterOptionWithHitsType[];
  setFilterHits(filters: TravelSearchFilterOptionWithHitsType[]): void;
};

const FiltersContext = createContext<FiltersContextState | undefined>(
  undefined,
);

export const FiltersContextProvider: React.FC = ({children}) => {
  const [filters, setFiltersState] =
    useState<TravelSearchFiltersSelectionType>();
  const [filterHits, setFilterHitsState] = useState<
    TravelSearchFilterOptionWithHitsType[]
  >([]);

  useEffect(() => {
    storedFilters.getFilters().then((filters) => setFiltersState(filters));
    storedFilterHits
      .getFilterHits()
      .then((filterHits) => setFilterHitsState(filterHits));
  }, []);

  const contextValue: FiltersContextState = {
    filters,
    async setFilters(filters: TravelSearchFiltersSelectionType) {
      const setFilters = await storedFilters.setFilters(filters);
      setFiltersState(setFilters);
    },
    filterHits,
    async setFilterHits(filters: TravelSearchFilterOptionWithHitsType[]) {
      const setFilterHits = await storedFilterHits.setFilterHits(filters);
      setFilterHitsState(setFilterHits);
    },
  };

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  );
};

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersContextProvider');
  }
  return context;
}
