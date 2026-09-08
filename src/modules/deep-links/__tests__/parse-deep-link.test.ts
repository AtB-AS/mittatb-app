import {parseDeepLink} from '../parse-deep-link';

describe('parseDeepLink', () => {
  it('splits the path from the query params', () => {
    expect(
      parseDeepLink('widget/addFavoriteDeparture?quayId=NSR:Quay:1&count=1'),
    ).toEqual({
      path: 'widget/addFavoriteDeparture',
      params: {quayId: 'NSR:Quay:1', count: '1'},
    });
  });

  it('parses a path without query params', () => {
    expect(parseDeepLink('privacy')).toEqual({path: 'privacy', params: {}});
  });

  it('parses an empty path', () => {
    expect(parseDeepLink('')).toEqual({path: '', params: {}});
  });

  it('strips surrounding and duplicated slashes', () => {
    expect(parseDeepLink('/widget//addFavoriteDeparture/').path).toBe(
      'widget/addFavoriteDeparture',
    );
  });

  it('strips the fragment', () => {
    expect(parseDeepLink('privacy#section')).toEqual({
      path: 'privacy',
      params: {},
    });
    expect(parseDeepLink('widget?stopId=1#section').params).toEqual({
      stopId: '1',
    });
  });

  it('decodes the query params', () => {
    expect(parseDeepLink('widget?stopName=Prinsens%20gate').params).toEqual({
      stopName: 'Prinsens gate',
    });
    expect(parseDeepLink('widget?stopName=Prinsens+gate').params).toEqual({
      stopName: 'Prinsens gate',
    });
  });

  it('parses a param without a value as an empty string', () => {
    expect(parseDeepLink('widget?stopId').params).toEqual({stopId: ''});
  });

  it('keeps the first value of a duplicated param', () => {
    expect(parseDeepLink('widget?stopId=1&stopId=2').params).toEqual({
      stopId: '1',
    });
  });
});
