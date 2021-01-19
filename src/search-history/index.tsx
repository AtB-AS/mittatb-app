import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  SearchHistoryLocation,
  SearchHistory,
  SearchHistoryJourney,
} from './types';
import {
  clearSearchHistory,
  addLocationSearchEntry as storage_addLocationSearchEntry,
  addJourneySearchEntry as storage_addJourneySearchEntry,
  getSearchHistory,
  addJourneySearchEntry,
} from './storage';

type SearchHistoryContextState = {
  history: SearchHistory;
  addLocationSearchEntry(searchEntry: SearchHistoryLocation): Promise<void>;
  addJourneySearchEntry(searchEntry: SearchHistoryJourney): Promise<void>;
  clearSearchHistory(): Promise<void>;
};
const SearchHistoryContext = createContext<
  SearchHistoryContextState | undefined
>(undefined);

const SearchHistoryContextProvider: React.FC = ({children}) => {
  const emptyHistory: SearchHistory = {locations: [], journeys: []};
  const [history, setSearchHistory] = useState<SearchHistory>(emptyHistory);
  async function populateSearchHistory() {
    const history = await getSearchHistory();
    setSearchHistory(history ?? emptyHistory);
  }

  useEffect(() => {
    populateSearchHistory();
  }, []);

  const contextValue: SearchHistoryContextState = {
    history,
    async addLocationSearchEntry(searchEntry: SearchHistoryLocation) {
      const history = await storage_addLocationSearchEntry(searchEntry);
      setSearchHistory(history);
    },
    async addJourneySearchEntry(searchEntry: SearchHistoryJourney) {
      const history = await storage_addJourneySearchEntry(searchEntry);
      setSearchHistory(history);
    },
    async clearSearchHistory() {
      const history = await clearSearchHistory();
      setSearchHistory(history);
    },
  };

  return (
    <SearchHistoryContext.Provider value={contextValue}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error(
      'useSearchHistory must be used within a SearchHistoryContextProvider',
    );
  }
  return context;
}

export default SearchHistoryContextProvider;
