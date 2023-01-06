import {SearchLocation} from '../favorites/types';

export type SearchHistoryEntry = SearchLocation;
export type SearchHistory = SearchHistoryEntry[];

export type JourneySearchHistoryEntry = [SearchLocation, SearchLocation];
export type JourneySearchHistory = JourneySearchHistoryEntry[];
