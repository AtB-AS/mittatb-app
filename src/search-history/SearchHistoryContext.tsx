import React, {createContext, useContext, useEffect, useState} from 'react';
import {journeyStore, searchStore} from './storage';
import {
  JourneySearchHistory,
  JourneySearchHistoryEntry,
  SearchHistory,
  SearchHistoryEntry,
} from './types';

export type {JourneySearchHistoryEntry} from './types';

type SearchHistoryContextState = {
  history: SearchHistory;
  addSearchEntry(searchEntry: SearchHistoryEntry): Promise<void>;

  journeyHistory: JourneySearchHistory;
  addJourneySearchEntry(searchEntry: JourneySearchHistoryEntry): Promise<void>;

  clearHistory(): Promise<void>;
};
const SearchHistoryContext = createContext<
  SearchHistoryContextState | undefined
>(undefined);

export const SearchHistoryContextProvider: React.FC = ({children}) => {
  const [history, setSearchHistory] = useState<SearchHistory>([]);
  const [journeyHistory, setJourneySearchHistory] = useState<
    JourneySearchHistoryEntry[]
  >([]);

  async function populateSearchHistory() {
    setSearchHistory(await searchStore.getHistory());
    setJourneySearchHistory(await journeyStore.getHistory());
  }

  useEffect(() => {
    populateSearchHistory();
  }, []);

  const contextValue: SearchHistoryContextState = {
    history,
    async addSearchEntry(searchEntry: SearchHistoryEntry) {
      const history = await searchStore.addEntry(searchEntry);
      setSearchHistory(history);
    },

    journeyHistory,
    async addJourneySearchEntry(searchEntry: JourneySearchHistoryEntry) {
      setJourneySearchHistory(await journeyStore.addEntry(searchEntry));
    },

    async clearHistory() {
      setSearchHistory(await searchStore.clear());
      setJourneySearchHistory(await journeyStore.clear());
    },
  };

  return (
    <SearchHistoryContext.Provider value={contextValue}>
      {children}
    </SearchHistoryContext.Provider>
  );
};

export function useSearchHistoryContext() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error(
      'useSearchHistory must be used within a SearchHistoryContextProvider',
    );
  }
  return context;
}
