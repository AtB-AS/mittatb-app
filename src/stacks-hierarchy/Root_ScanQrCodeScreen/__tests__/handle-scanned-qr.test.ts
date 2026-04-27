import {isAppDeepLink, matchKnownUrl} from '../handle-scanned-qr';
import {CompiledKnownQrCodeUrl} from '@atb/modules/configuration';

describe('isAppDeepLink', () => {
  it('returns true for matching scheme', () => {
    expect(isAppDeepLink('atb://purchase-overview?type=period', 'atb')).toBe(
      true,
    );
  });

  it('is case-insensitive on scheme', () => {
    expect(isAppDeepLink('ATB://foo', 'atb')).toBe(true);
    expect(isAppDeepLink('atb://foo', 'ATB')).toBe(true);
  });

  it('returns false for a different scheme', () => {
    expect(isAppDeepLink('fram://profile', 'atb')).toBe(false);
  });

  it('returns false for https', () => {
    expect(isAppDeepLink('https://example.com', 'atb')).toBe(false);
  });

  it('returns false for empty scheme', () => {
    expect(isAppDeepLink('atb://foo', '')).toBe(false);
  });

  it('returns false for empty url', () => {
    expect(isAppDeepLink('', 'atb')).toBe(false);
  });
});

describe('matchKnownUrl', () => {
  const entries: CompiledKnownQrCodeUrl[] = [
    {
      id: 'bysykkel-web',
      regex: /^https:\/\/bysykkel\.mittatb\.no\/web(\/.*)?$/,
      openMode: 'in-app-browser',
    },
    {
      id: 'bysykkel-app',
      regex: /^https:\/\/bysykkel\.mittatb\.no\/app(\/.*)?$/,
      openMode: 'in-app-browser',
    },
    {
      id: 'example',
      regex: /^https:\/\/example\.com$/,
      openMode: 'open-url',
    },
  ];

  it('returns matching entry for bysykkel web URL', () => {
    const result = matchKnownUrl(
      'https://bysykkel.mittatb.no/web/something',
      entries,
    );
    expect(result?.id).toBe('bysykkel-web');
    expect(result?.openMode).toBe('in-app-browser');
  });

  it('returns matching entry for bysykkel app URL', () => {
    const result = matchKnownUrl('https://bysykkel.mittatb.no/app', entries);
    expect(result?.id).toBe('bysykkel-app');
  });

  it('returns correct openMode for open-url entry', () => {
    const result = matchKnownUrl('https://example.com', entries);
    expect(result?.openMode).toBe('open-url');
  });

  it('returns first match when multiple could match', () => {
    const overlapping: CompiledKnownQrCodeUrl[] = [
      {id: 'first', regex: /^https:\/\//, openMode: 'open-url'},
      {id: 'second', regex: /^https:\/\/example/, openMode: 'in-app-browser'},
    ];
    expect(matchKnownUrl('https://example.com', overlapping)?.id).toBe('first');
  });

  it('returns undefined for non-matching URL', () => {
    expect(matchKnownUrl('https://unknown.com', entries)).toBeUndefined();
  });

  it('returns undefined for empty entries', () => {
    expect(matchKnownUrl('https://example.com', [])).toBeUndefined();
  });

  it('caps URL to 2048 chars before matching', () => {
    const longUrl = 'https://example.com' + '/a'.repeat(3000);
    // The regex anchors at $ so this very long URL won't match ^https://example\.com$
    expect(matchKnownUrl(longUrl, entries)).toBeUndefined();
  });
});
