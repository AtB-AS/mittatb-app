import {stringify} from 'query-string';
import storage, {StorageModel} from '../storage';
import {
  SearchHistory,
  SearchHistoryJourney,
  SearchHistoryLocation,
} from './types';

// @TODO Should be configurable. Also now used to limit store,
// but in the future with external storage, this
const HISTORY_LIMIT = 10;

const STORAGE_KEY_LOCATIONS = '@ATB_search-history';
const STORAGE_KEY_JOURNEYS = '@ATB_journey-search-history';

const emptySearchHistory: SearchHistory = {journeys: [], locations: []};

export async function getSearchHistory(): Promise<SearchHistory> {
  const searchHistory = await storage.getMultiple([
    STORAGE_KEY_LOCATIONS,
    STORAGE_KEY_JOURNEYS,
  ]);
  if (!searchHistory) return emptySearchHistory;

  const data = {
    journeys: JSON.parse(searchHistory['@ATB_journey-search-history'] ?? '[]'),
    locations: JSON.parse(searchHistory['@ATB_search-history'] ?? '[]'),
  };
  return data;
}

async function setSearchHistory(
  completeHistory: SearchHistory,
): Promise<SearchHistory> {
  await storage.setMultiple([
    {[STORAGE_KEY_LOCATIONS]: JSON.stringify(completeHistory.locations)},
    {[STORAGE_KEY_JOURNEYS]: JSON.stringify(completeHistory.journeys)},
  ]);
  return completeHistory;
}

export async function addLocationSearchEntry(
  locationEntry: SearchHistoryLocation,
): Promise<SearchHistory> {
  let searchHistory = await getSearchHistory();

  searchHistory.locations = [locationEntry].concat(
    removeExistingLocation(searchHistory, locationEntry),
  );
  // Keeping search history down in storage to prevent it from
  // being too large. Current size limit is 6 MB (by default).
  if (searchHistory.locations.length > HISTORY_LIMIT) {
    searchHistory.locations.pop();
  }
  return await setSearchHistory(searchHistory);
}
function removeExistingLocation(
  history: SearchHistory,
  entry: SearchHistoryLocation,
) {
  return history.locations.filter((item) => !sameLocation(item, entry));
}

export async function addJourneySearchEntry(
  journeyEntry: SearchHistoryJourney,
): Promise<SearchHistory> {
  let searchHistory = await getSearchHistory();

  searchHistory.journeys = [journeyEntry].concat(
    removeExistingJourney(searchHistory, journeyEntry),
  );
  // Keeping search history down in storage to prevent it from
  // being too large. Current size limit is 6 MB (by default).
  if (searchHistory.journeys.length > HISTORY_LIMIT) {
    searchHistory.journeys.pop();
  }
  return await setSearchHistory(searchHistory);
}
function removeExistingJourney(
  history: SearchHistory,
  entry: SearchHistoryJourney,
) {
  return history.journeys.filter((item) => !sameJourney(item, entry));
}
function sameJourney(J1: SearchHistoryJourney, J2: SearchHistoryJourney) {
  return sameLocation(J1.from, J2.from) && sameLocation(J1.to, J2.to);
}

function sameLocation(
  L1: SearchHistoryLocation,
  L2: SearchHistoryLocation,
): boolean {
  return L1.id === L2.id;
}

export async function clearSearchHistory(): Promise<SearchHistory> {
  return await setSearchHistory(emptySearchHistory);
}
