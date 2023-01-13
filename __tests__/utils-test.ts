import {iterateWithNext} from '@atb/utils/array';
import {addMinutes} from 'date-fns';
import {Leg} from '@atb/api/types/trips';
import {TIME_LIMIT_IN_MINUTES} from '@atb/screens/TripDetails/Details/utils';
import {hasShortWaitTime} from '@atb/screens/TripDetails/components/utils';
import {Flattened, flattenObject} from '@atb/utils/object';
import {onlyUniques, onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {compareVersion} from '@atb/utils/compare-version';
import {expectNumber} from '../e2e/utils/jestAssertions';

describe('IterateWithNext', () => {
  it('iterates correctly', () => {
    const empty_array = [] as number[];
    const array_with_one = [1];
    const array_with_even = [1, 2, 3, 4];
    const array_with_odd = [1, 2, 3];

    const iterateWithNone = iterateWithNext(empty_array);
    expect(iterateWithNone).toEqual([]);

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

describe('Short wait time evaluator', () => {
  const nowDate = Date.now();
  const Leg1: Leg = {
    expectedStartTime: nowDate,
    expectedEndTime: addMinutes(nowDate, 5),
  } as Leg;

  const Leg2: Leg = {
    expectedStartTime: addMinutes(nowDate, 5 + TIME_LIMIT_IN_MINUTES - 1),
    expectedEndTime: addMinutes(nowDate, 10),
  } as Leg;

  const Leg3: Leg = {
    expectedStartTime: addMinutes(nowDate, 5 + TIME_LIMIT_IN_MINUTES + 1),
    expectedEndTime: addMinutes(nowDate, 10),
  } as Leg;

  const Leg4: Leg = {
    expectedStartTime: addMinutes(nowDate, 15),
    expectedEndTime: addMinutes(nowDate, 20),
  } as Leg;

  const weirdLeg: Leg = {
    expectedStartTime: 'non parsable string',
    expectedEndTime: {weird: true},
  } as Leg;

  it('catches a short wait', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg2]);
    expect(isShortWait).toBe(true);
  });
  it('passes on a long wait', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg3]);
    expect(isShortWait).toBe(false);
  });
  it('catches a short wait with more legs', () => {
    const isShortWait = hasShortWaitTime([Leg1, Leg2, Leg4]);
    expect(isShortWait).toBe(true);
  });
  it('passes on only one leg', () => {
    const isShortWait = hasShortWaitTime([Leg1]);
    expect(isShortWait).toBe(false);
  });
  it('passes with empty array', () => {
    const isShortWait = hasShortWaitTime([]);
    expect(isShortWait).toBe(false);
  });
  it('passes on weird data', () => {
    const isShortWait = hasShortWaitTime([weirdLeg, weirdLeg]);
    expect(isShortWait).toBe(false);
  });
});

describe('Function flattenObject()', () => {
  const inputObj = {
    a: 1,
    b: {ba: 2, bb: {bba: 0}, bc: [1, 2, 3]},
    c: 'Hello',
    d: [4, 5, 6],
  };
  const expectedObj = {
    a: 1,
    ba: 2,
    bb: {bba: 0},
    bc: [1, 2, 3],
    c: 'Hello',
    d: [4, 5, 6],
  };

  type ExpectedObj = Flattened<typeof inputObj>;
  const flatObj = flattenObject(inputObj);

  it('returns expected object', () => {
    expect(JSON.stringify(flatObj) === JSON.stringify(expectedObj)).toBe(true);
  });

  it('has expected type', () => {
    expect(flatObj as ExpectedObj).toBeTruthy();
  });
});

describe('Function onlyUnique', () => {
  const input = [1, 'a', 3, 'k', 3, 'a'];
  const expected = [1, 'a', 3, 'k'];

  it('only contains unique values', () => {
    expect(input.filter(onlyUniques).sort()).toEqual(expected.sort());
  });
});

describe('Function onlyUniqueBasedOnField', () => {
  const input = [
    {field1: 'test1', field2: 'what'},
    {field1: 'test1', field2: 'what'},
    {field1: 'test2', field2: 'what'},
  ];
  const expected = [
    {field1: 'test1', field2: 'what'},
    {field1: 'test2', field2: 'what'},
  ];

  it('only contains unique values', () => {
    expect(input.filter(onlyUniquesBasedOnField('field1')).sort()).toEqual(
      expected.sort(),
    );
  });
});

describe('Function compareVersion', () => {
  const versions: [string, string, number][] = [
    ['1.2', '1.1', 1],
    ['1.4', '1.31', -1],
    ['1.4.1', '1.31.1', -1],
    ['1.1.1', '1.1', 1],
    ['1.1', '1.1.1', -1],
    ['2.1', '1.1', 1],
    ['1.1', '2.1', -1],
    ['1.1', '1.1', 0],
    ['1', '1', 0],
  ];

  versions.forEach((v) => {
    it('returns correct comparison', () => {
      expectNumber(compareVersion(v[0], v[1]), v[2]);
    });
  });
});
