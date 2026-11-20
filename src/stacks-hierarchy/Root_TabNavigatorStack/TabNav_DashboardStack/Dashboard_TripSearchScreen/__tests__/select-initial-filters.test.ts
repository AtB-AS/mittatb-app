import {
  TransportModeFilterOptionWithSelectionType,
  TravelSearchPreferenceWithSelectionType,
} from '@atb/modules/travel-search-filters';
import {
  overridePreferenceValues,
  selectTransportModeFiltersById,
} from '../utils';

describe('selectTransportModeFiltersById', () => {
  const TRANSPORT_MODES = [
    {id: 'bus', selectedAsDefault: true, selected: true},
    {id: 'rail', selectedAsDefault: true, selected: false},
    {id: 'air', selectedAsDefault: false, selected: true},
  ] as TransportModeFilterOptionWithSelectionType[];

  const selectedIds = (
    transportModes?: TransportModeFilterOptionWithSelectionType[],
  ) => transportModes?.filter((tm) => tm.selected).map((tm) => tm.id);

  it('selects only the transport modes with the given ids', () => {
    expect(
      selectedIds(
        selectTransportModeFiltersById(TRANSPORT_MODES, ['rail', 'air']),
      ),
    ).toEqual(['rail', 'air']);
  });

  it('ignores unknown ids', () => {
    expect(
      selectedIds(
        selectTransportModeFiltersById(TRANSPORT_MODES, ['rail', 'foo']),
      ),
    ).toEqual(['rail']);
  });

  it.each([[undefined], [[]], [['foo']]])(
    'returns undefined for the ids %p',
    (ids) => {
      expect(
        selectTransportModeFiltersById(TRANSPORT_MODES, ids),
      ).toBeUndefined();
    },
  );
});

describe('overridePreferenceValues', () => {
  const option = (id: string, value: number) => ({id, text: [], value});
  const PREFERENCES = [
    {
      type: 'walkSpeed',
      title: [],
      options: [option('slow', 0.8), option('normal', 1.3), option('fast', 2)],
      defaultOption: 'normal',
      selectedOption: 'normal',
    },
    {
      type: 'transferSlack',
      title: [],
      options: [option('0', 0), option('2', 120), option('5', 300)],
      defaultOption: '2',
      selectedOption: '2',
    },
  ] as TravelSearchPreferenceWithSelectionType[];

  const selections = (preferences: TravelSearchPreferenceWithSelectionType[]) =>
    preferences.map(({selectedOption, overrideValue}) => ({
      selectedOption,
      overrideValue,
    }));

  it('overrides only the given values, keeping the selected options', () => {
    expect(
      selections(overridePreferenceValues(PREFERENCES, {transferSlack: 0})),
    ).toEqual([
      {selectedOption: 'normal', overrideValue: undefined},
      {selectedOption: '2', overrideValue: 0},
    ]);
  });
});
