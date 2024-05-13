import {TransportModeFilterOptionWithSelectionType} from '@atb/travel-search-filters';

export const areDefaultFiltersSelected = (
  transportModes?: TransportModeFilterOptionWithSelectionType[],
): boolean => {
  if (!transportModes) return false;
  return !transportModes.some((tm) => tm.selectedAsDefault !== tm.selected);
};
