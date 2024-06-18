import {SearchLocation} from '@atb/favorites';
import {isVenue} from '../utils';

describe('isVenue', () => {
  it('should return false when `resultType` is not `search`.', () => {
    const input = {resultType: 'favorite'} as SearchLocation;
    expect(isVenue(input)).toBeFalsy();
  });

  it('should return false when `resultType` is undefined.', () => {
    const input = {layer: 'venue'} as SearchLocation;
    expect(isVenue(input)).toBeFalsy();
  });

  it('should return false when `layer` is undefined.', () => {
    const input = {resultType: 'search'} as SearchLocation;
    expect(isVenue(input)).toBeFalsy();
  });

  it('should return false when `resultType` is `search` and `layer` is not venue.', () => {
    const input = {resultType: 'search', layer: 'address'} as SearchLocation;
    expect(isVenue(input)).toBeFalsy();
  });

  it('should return true when `resultType` is `search` and `layer` is venue.', () => {
    const input = {resultType: 'search', layer: 'venue'} as SearchLocation;
    expect(isVenue(input)).toBeTruthy();
  });
});
