import {iterateWithNext} from '../src/utils/array';

describe('IterateWIthNext', () => {
  it('iterates correctly', () => {
    const array_with_one = [1];
    const array_with_even = [1, 2, 3, 4];
    const array_with_odd = [1, 2, 3];

    const iterateWithOne = iterateWithNext(array_with_one);
    expect(iterateWithOne).toEqual([]);

    const iterateWithEven = iterateWithNext(array_with_even);
    expect(iterateWithEven).toEqual([
      {current: 1, next: 2},
      {current: 2, next: 3},
      {current: 3, next: 4},
    ]);

    const iterateWithOdd = iterateWithNext(array_with_odd);
    expect(iterateWithOdd).toEqual([
      {current: 1, next: 2},
      {current: 2, next: 3},
    ]);
  });
});

describe('suite', () => {
  it('should do X', () => {
    expect(true).toBe(true);
  });
});
