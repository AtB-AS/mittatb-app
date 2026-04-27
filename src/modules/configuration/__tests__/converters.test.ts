import {
  mapToKnownQrCodeUrls,
  mapToTransportModeFilterOptions,
} from '../converters';

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

describe('mapToKnownQrCodeUrls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty list for undefined input without notifying Bugsnag', () => {
    expect(mapToKnownQrCodeUrls(undefined)).toEqual([]);
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it('parses and pre-compiles regex for valid entries', () => {
    const result = mapToKnownQrCodeUrls({
      urls: [
        {
          id: 'bysykkel-web',
          pattern: '^https://bysykkel\\.mittatb\\.no/web(/.*)?$',
          openMode: 'in-app-browser',
        },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('bysykkel-web');
    expect(result[0].openMode).toBe('in-app-browser');
    expect(result[0].regex).toBeInstanceOf(RegExp);
    expect(result[0].regex.test('https://bysykkel.mittatb.no/web')).toBe(true);
    expect(result[0].regex.test('https://evil.example.com/')).toBe(false);
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });

  it('drops entries with invalid regex and notifies Bugsnag, keeping valid ones', () => {
    const result = mapToKnownQrCodeUrls({
      urls: [
        {id: 'bad', pattern: '[unclosed', openMode: 'open-url'},
        {
          id: 'good',
          pattern: '^https://example\\.com$',
          openMode: 'open-url',
        },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('good');
    expect(Bugsnag.notify).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list and notifies Bugsnag when the shape is invalid', () => {
    expect(mapToKnownQrCodeUrls({urls: 'not an array'})).toEqual([]);
    expect(Bugsnag.notify).toHaveBeenCalledTimes(1);
  });

  it('drops entries with an unknown openMode', () => {
    const result = mapToKnownQrCodeUrls({
      urls: [
        {id: 'bad-mode', pattern: '^x$', openMode: 'system-browser'},
        {id: 'ok', pattern: '^x$', openMode: 'open-url'},
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ok');
  });
});
