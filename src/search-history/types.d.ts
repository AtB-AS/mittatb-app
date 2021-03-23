import {Location} from '../favorites/types';

export type SearchHistoryEntry = Location;
export type SearchHistory = SearchHistoryEntry[];

export type JourneySearchHistoryEntry = [Location, Location];
export type JourneySearchHistory = JourneySearchHistoryEntry[];
