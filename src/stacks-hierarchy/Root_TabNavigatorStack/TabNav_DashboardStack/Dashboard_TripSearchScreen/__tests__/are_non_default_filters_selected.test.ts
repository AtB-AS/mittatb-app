import {TransportModeFilterOptionWithSelectionType} from '@atb/travel-search-filters';
import {areDefaultFiltersSelected} from '../are-default-filters-selected';

describe('areDefaultFiltersSelected', () => {
  it('should return false if input `transportModes` is undefined.', () => {
    expect(areDefaultFiltersSelected()).toBeFalsy();
  });

  it('should return false if any filter other than the default filters is selected.', () => {
    const tmfInput = [
      {id: 'bus', selectedAsDefault: true, selected: true},
      {id: 'air', selectedAsDefault: false, selected: true},
    ] as TransportModeFilterOptionWithSelectionType[];
    expect(areDefaultFiltersSelected(tmfInput)).toBeFalsy();
  });

  it('should return true if default filters are selected.', () => {
    const tmfInput = [
      {id: 'bus', selectedAsDefault: true, selected: true},
      {id: 'air', selectedAsDefault: false, selected: false},
    ] as TransportModeFilterOptionWithSelectionType[];

    expect(areDefaultFiltersSelected(tmfInput)).toBeTruthy();
  });
});
