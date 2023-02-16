import React, {createContext, useContext, useEffect, useState} from 'react';
import {storedFilters} from './storage';
import {TransportModeFilterOptionWithSelectionType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';

type FiltersContextState = {
  filters: TransportModeFilterOptionWithSelectionType[];
  setFilters(
    filters: TransportModeFilterOptionWithSelectionType[] | undefined,
  ): void;
};
const FiltersContext = createContext<FiltersContextState | undefined>(
  undefined,
);

const FiltersContextProvider: React.FC = ({children}) => {
  const [filters, setFiltersState] = useState<
    TransportModeFilterOptionWithSelectionType[]
  >([]);

  useEffect(() => {
    storedFilters.getFilters().then((filters) => setFiltersState(filters));
  }, []);

  const contextValue: FiltersContextState = {
    filters,
    async setFilters(filters: TransportModeFilterOptionWithSelectionType[]) {
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

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersContextProvider');
  }
  return context;
}

export default FiltersContextProvider;
