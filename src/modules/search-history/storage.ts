import {JourneySearchHistoryEntry, SearchHistoryEntry} from './types';
import {storage, StorageModelTypes} from '@atb/modules/storage';

// @TODO Should be configurable. Also now used to limit store,
// but in the future with external storage, this
const HISTORY_LIMIT = 10;

class HistoryStore<T = SearchHistoryEntry | JourneySearchHistoryEntry> {
  private key: StorageModelTypes;
  private eqaulityComparator: (a: T, b: T) => boolean;

  constructor(
    key: StorageModelTypes,
    eqaulityComparator: (a: T, b: T) => boolean,
  ) {
    this.key = key;
    this.eqaulityComparator = eqaulityComparator;
  }

  async getHistory(): Promise<T[]> {
    const searchHistory = await storage.get(this.key);
    if (!searchHistory) return [];
    try {
      const parsed = JSON.parse(searchHistory);
      if (!parsed || !Array.isArray(parsed)) return [];
      return parsed as T[];
    } catch {
      return [];
    }
  }

  async addEntry(searchEntry: T): Promise<T[]> {
    let searchHistory = await this.getHistory();
    searchHistory = [searchEntry].concat(
      this.removeExisting(searchHistory, searchEntry),
    );

    // Keeping search history down in storage to prevent it from
    // beeing too large. Current size limit is 6 MB (by default).
    if (searchHistory.length > HISTORY_LIMIT) {
      searchHistory.pop();
    }
    return await this.setSearchHistory(searchHistory);
  }

  async clear(): Promise<T[]> {
    return await this.setSearchHistory([]);
  }

  private async setSearchHistory(completeHistory: T[]): Promise<T[]> {
    await storage.set(this.key, JSON.stringify(completeHistory));
    return completeHistory;
  }

  private removeExisting(history: T[], entry: T) {
    return history.filter((item) => !this.eqaulityComparator(item, entry));
  }
}

export const STORAGE_KEY = '@ATB_search-history';
export const JOURNEY_STORAGE_KEY = '@ATB_journey_search-history';

export const searchStore = new HistoryStore<SearchHistoryEntry>(
  STORAGE_KEY,
  (a, b) => a.id === b.id,
);

const equals = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);
export const journeyStore = new HistoryStore<JourneySearchHistoryEntry>(
  JOURNEY_STORAGE_KEY,
  (a, b) =>
    equals(
      a.map((i) => i.id),
      b.map((i) => i.id),
    ),
);
