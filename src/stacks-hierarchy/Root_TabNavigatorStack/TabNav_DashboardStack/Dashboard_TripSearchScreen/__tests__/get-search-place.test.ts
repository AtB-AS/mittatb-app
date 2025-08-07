import {Location, SearchLocation} from '@atb/modules/favorites';
import {getSearchPlace} from '../utils';
import {FeatureCategory} from '@atb/api/bff/types';

const ID = 'TEST_ID';

describe('getSearchPlaces', () => {
  it('should return undefined when location.resultType is not `search`.', () => {
    const input = {
      id: ID,
      resultType: 'favorite',
      layer: 'venue',
    } as Location;
    expect(getSearchPlace(input)).toBeUndefined();
  });

  it('should return undefined when location.category is undefined.', () => {
    const input = {
      id: ID,
      resultType: 'search',
    } as SearchLocation;
    expect(getSearchPlace(input)).toBeUndefined();
  });

  it('should return undefined when location.category is empty.', () => {
    const input = {
      id: ID,
      resultType: 'search',
      category: [] as FeatureCategory[],
    } as Location;
    expect(getSearchPlace(input)).toBeUndefined();
  });

  it('should return undefined when location.category is set to a FeatureCategory other than `GroupOfStopPlaces`.', () => {
    const input = {
      id: ID,
      resultType: 'search',
      category: [FeatureCategory.OTHER],
    } as Location;
    expect(getSearchPlace(input)).toBeUndefined();
  });

  it('should return id string when location.resultType is `search` and location.layer is `venue`.', () => {
    const input = {
      id: ID,
      resultType: 'search',
      layer: 'venue',
    } as Location;
    expect(getSearchPlace(input)).toBe(ID);
  });

  it('should return id string when location.resultType is `search` and location.category is `GroupOfStopPlaces`.', () => {
    const input = {
      id: ID,
      resultType: 'search',
      category: [FeatureCategory.GROUP_OF_STOP_PLACES],
    } as SearchLocation;
    expect(getSearchPlace(input)).toBe(ID);
  });

  it('should return id string when location.resultType is `search`, location.layer is `venue` and location.category is `GroupOfStopPlaces`.', () => {
    const input = {
      id: ID,
      resultType: 'search',
      layer: 'venue',
      category: [FeatureCategory.GROUP_OF_STOP_PLACES],
    } as SearchLocation;
    expect(getSearchPlace(input)).toBe(ID);
  });
});
