import storage from '../storage';
import {SearchHistory, SearchHistoryEntry} from './types';

// @TODO Should be configurable. Also now used to limit store,
// but in the future with external storage, this
const HISTORY_LIMIT = 10;

const STORAGE_KEY = '@ATB_search-history';

export async function getSearchHistory(): Promise<SearchHistory> {
  const searchHistory = await storage.get(STORAGE_KEY);
  if (!searchHistory) return [];
  let data = (searchHistory ? JSON.parse(searchHistory) : []) as SearchHistory;
  return data;
}

async function setSearchHistory(
  completeHistory: SearchHistory,
): Promise<SearchHistory> {
  await storage.set(STORAGE_KEY, JSON.stringify(completeHistory));
  return completeHistory;
}

export async function addSearchEntry(
  searchEntry: SearchHistoryEntry,
): Promise<SearchHistory> {
  let searchHistory = (await getSearchHistory()) ?? [];
  searchHistory = [searchEntry].concat(
    removeExistingEntry(searchHistory, searchEntry),
  );

  // Keeping search history down in storage to prevent it from
  // beeing too large. Current size limit is 6 MB (by default).
  if (searchHistory.length > HISTORY_LIMIT) {
    searchHistory.pop();
  }
  return await setSearchHistory(searchHistory);
}

export async function clearSearchHistory(): Promise<SearchHistory> {
  return await setSearchHistory([]);
}

function removeExistingEntry(
  history: SearchHistory,
  entry: SearchHistoryEntry,
) {
  return history.filter((item) => item.id !== entry.id);
}
