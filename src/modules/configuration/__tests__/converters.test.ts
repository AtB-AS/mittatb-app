import {mapToTransportModeFilterOptions} from '../converters';

jest.mock('@bugsnag/react-native', () => ({
  notify: jest.fn(),
}));

import Bugsnag from '@bugsnag/react-native';

const validFilter = {
  id: 'bus',
  icon: {transportMode: 'bus'},
  text: [{lang: 'nob', value: 'Buss'}],
  modes: [{transportMode: 'bus'}],
  selectedAsDefault: true,
};

describe('mapToTransportModeFilterOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined without notifying Bugsnag when input is undefined', () => {
    expect(mapToTransportModeFilterOptions(undefined)).toBeUndefined();
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it('returns undefined without notifying Bugsnag when input is null', () => {
    expect(mapToTransportModeFilterOptions(null)).toBeUndefined();
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it('returns undefined and notifies Bugsnag when input is a string', () => {
    expect(mapToTransportModeFilterOptions('not an array')).toBeUndefined();
    expect(Bugsnag.notify).toHaveBeenCalledTimes(1);
  });

  it('returns undefined and notifies Bugsnag when input is a number', () => {
    expect(mapToTransportModeFilterOptions(42)).toBeUndefined();
    expect(Bugsnag.notify).toHaveBeenCalledTimes(1);
  });

  it('returns undefined and notifies Bugsnag when input is an object', () => {
    expect(mapToTransportModeFilterOptions({key: 'value'})).toBeUndefined();
    expect(Bugsnag.notify).toHaveBeenCalledTimes(1);
  });

  it('returns parsed filter options for a valid array', () => {
    const result = mapToTransportModeFilterOptions([validFilter]);
    expect(result).toEqual([
      expect.objectContaining({id: 'bus', selectedAsDefault: true}),
    ]);
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it('filters out invalid items from the array', () => {
    const result = mapToTransportModeFilterOptions([
      validFilter,
      {id: 'invalid', text: 'wrong'},
    ]);
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual(expect.objectContaining({id: 'bus'}));
  });

  it('returns an empty array when all items are invalid', () => {
    const result = mapToTransportModeFilterOptions([
      {id: 'invalid'},
      {text: 'wrong'},
    ]);
    expect(result).toEqual([]);
  });
});
