import type {Location} from '@atb/modules/favorites';
import type {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import {
  createTripsQuery,
  TripsInfiniteQueryProps,
} from '../use-trips-infinite-query';

jest.mock('@atb/api/bff/trips', () => ({}));

describe('createTripsQuery', () => {
  const LOCATION = {
    id: 'NSR:StopPlace:337',
    resultType: 'search',
    layer: 'venue',
    category: [],
  } as unknown as Location;

  const walkSpeed = (
    overrideValue: number,
  ): TravelSearchPreferenceWithSelectionType => ({
    type: 'walkSpeed',
    title: [],
    options: [
      {id: 'slow', text: [], value: 0.8},
      {id: 'normal', text: [], value: 1.3},
    ],
    defaultOption: 'normal',
    selectedOption: 'slow',
    overrideValue,
  });

  const createQuery = (preference: TravelSearchPreferenceWithSelectionType) =>
    createTripsQuery({
      fromLocation: LOCATION,
      toLocation: LOCATION,
      arriveBy: false,
      searchTime: {option: 'now', date: '2026-11-19T12:00:00.000Z'},
      travelSearchFiltersSelection: {travelSearchPreferences: [preference]},
      includeCancellations: false,
      journeySearchModes: {},
    } as TripsInfiniteQueryProps);

  it('searches with the override value instead of the selected option', () => {
    expect(createQuery(walkSpeed(1.5)).walkSpeed).toBe(1.5);
    expect(createQuery(walkSpeed(0)).walkSpeed).toBe(0);
  });
});
