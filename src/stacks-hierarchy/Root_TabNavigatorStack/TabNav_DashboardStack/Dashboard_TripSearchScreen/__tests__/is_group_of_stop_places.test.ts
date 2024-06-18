import {SearchLocation} from '@atb/favorites';
import {isGroupOfStopPlaces} from '../utils';
import {FeatureCategory} from '@atb/sdk';

describe('isGroupOfStopPlaces', () => {
  it('should return false when `resultType` is not `search`.', () => {
    const input = {resultType: 'favorite'} as SearchLocation;
    expect(isGroupOfStopPlaces(input)).toBeFalsy();
  });

  it('should return false when `resultType` is undefined.', () => {
    const input = {category: 'adress'} as unknown as SearchLocation;
    expect(isGroupOfStopPlaces(input)).toBeFalsy();
  });

  it('should return false when `resultType` is `search` and `category` is not `GroupOfStopPlaces`.', () => {
    const input = {
      resultType: 'search',
      category: ['street'] as FeatureCategory[],
    } as SearchLocation;
    expect(isGroupOfStopPlaces(input)).toBeFalsy();
  });

  it('should return true when `resultType` is `search` and `category` is `GroupOfStopPlaces`.', () => {
    const input = {
      resultType: 'search',
      category: ['GroupOfStopPlaces'] as FeatureCategory[],
    } as SearchLocation;
    expect(isGroupOfStopPlaces(input)).toBeTruthy();
  });
});
