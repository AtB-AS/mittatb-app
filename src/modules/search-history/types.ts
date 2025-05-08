import {SearchLocation} from '@atb/modules/favorites';

export type SearchHistoryEntry = SearchLocation;
export type SearchHistory = SearchHistoryEntry[];

export type JourneySearchHistoryEntry = [SearchLocation, SearchLocation];
export type JourneySearchHistory = JourneySearchHistoryEntry[];
