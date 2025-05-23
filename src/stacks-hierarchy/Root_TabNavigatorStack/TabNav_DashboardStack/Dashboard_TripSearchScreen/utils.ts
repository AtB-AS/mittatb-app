import {TransportModeFilterOptionWithSelectionType} from '@atb/modules/travel-search-filters';
import {
  Language,
  type TranslateFunction,
  TripSearchTexts,
} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import type {TripSearchTime} from '@atb/modules/trip-search';

export const areDefaultFiltersSelected = (
  transportModes?: TransportModeFilterOptionWithSelectionType[],
): boolean => {
  if (!transportModes || transportModes.length === 0) return false;
  return transportModes.every((tm) => tm.selectedAsDefault === tm.selected);
};

export function getSearchTimeLabel(
  searchTime: TripSearchTime,
  timeOfLastSearch: string,
  t: TranslateFunction,
  language: Language,
) {
  const date = searchTime.option === 'now' ? timeOfLastSearch : searchTime.date;
  const time = formatToLongDateTime(date, language);

  switch (searchTime.option) {
    case 'now':
      return t(TripSearchTexts.dateInput.departureNow(time));
    case 'arrival':
      return t(TripSearchTexts.dateInput.arrival(time));
    case 'departure':
      return t(TripSearchTexts.dateInput.departure(time));
  }
}
