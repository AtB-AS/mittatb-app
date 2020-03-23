import React, {createContext, useContext, useEffect, useState} from 'react';
import {SearchHistoryEntry, SearchHistory} from './types';
import {
  clearSearchHistory,
  addSearchEntry as storage_addSearchEntry,
  getSearchHistory,
} from './storage';

type SearchHistoryContextState = {
  history: SearchHistory;
  addSearchEntry(searchEntry: SearchHistoryEntry): Promise<void>;
  clearSearchHistory(): Promise<void>;
};
const SearchHistoryContext = createContext<
  SearchHistoryContextState | undefined
>(undefined);

const SearchHistoryContextProvider: React.FC = ({children}) => {
  const [history, setSearchHistory] = useState<SearchHistory>([]);
  async function populateSearchHistory() {
    const history = await getSearchHistory();
    setSearchHistory(history ?? []);
  }

  useEffect(() => {
    populateSearchHistory();
  }, []);

  const contextValue: SearchHistoryContextState = {
    history,
    async addSearchEntry(searchEntry: SearchHistoryEntry) {
      const history = await storage_addSearchEntry(searchEntry);
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
