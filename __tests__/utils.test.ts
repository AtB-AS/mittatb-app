import {iterateWithNext} from '@atb/utils/array';
import {Flattened, flattenObject} from '@atb/utils/object';
import {onlyUniques, onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {compareVersion} from '@atb/utils/compare-version';
import {
  expectNumber,
  expectStringEqual,
} from '../e2e/test/utils/jestAssertions';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  fullDateTime,
} from '@atb/utils/date';
import {Language} from '@atb/translations/commons';

jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@bugsnag/react-native', () => ({}));

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

  it('removes undefined if treatUndefinedAsUnique is false', () => {
    const testData = [
      {field1: 'id-1'},
      {field1: 'id-1'},
      {field1: 'id-2'},
      {field1: undefined},
      {field1: undefined},
    ];

    const deduped1 = testData.filter(onlyUniquesBasedOnField('field1'));
    expect(deduped1.length).toEqual(3);

    const deduped2 = testData.filter(onlyUniquesBasedOnField('field1', false));
    expect(deduped2.length).toEqual(3);
  });

  it('does not remove undefined if treatUndefinedAsUnique is true', () => {
    const testData = [
      {field1: 'id-1'},
      {field1: 'id-2'},
      {field1: undefined},
      {field1: undefined},
    ];
    const deduped = testData.filter(onlyUniquesBasedOnField('field1', true));
    expect(deduped.length).toEqual(4);
  });
});

describe('Function compareVersion', () => {
  const versions: [string, string, number][] = [
    // first version is greater
    ['1.2', '1.1', 1],
    ['1.1.1', '1.1', 1],
    ['1.100.1', '1.1', 1],
    ['1.3.0', '1.2.3', 1],
    ['2.0.3', '1.2.0', 1],
    ['2.1', '1.1.1', 1],
    ['2.3.1', '2.1.2', 1],
    ['2.1.1', '2.0.2', 1],
    ['2.0.0', '1.2.3', 1],
    ['2.1', '1.1', 1],
    // second version is greater
    ['1.4', '1.31', -1],
    ['1.4.1', '1.31.1', -1],
    ['1.1', '1.1.1', -1],
    ['1.1', '2.1', -1],
    ['1.2.3', '1.2.4', -1],
    ['1.2.0', '1.2.1', -1],
    ['1.2.3', '2.0.0', -1],
    // same version
    ['1.2', '1.2.0', 0],
    ['1.2.0', '1.2', 0],
    ['1.1', '1.1', 0],
    ['1', '1', 0],
    // empty strings
    ['', '1.0.0', NaN],
    ['1.2.0', '', NaN],
    ['', '', NaN],
    // edge cases
    ['0.0.0', '0.0.0', 0],
    ['0.0.0', '0.0.1', -1],
    ['0.0.1', '0.0.0', 1],
  ];

  versions.forEach(([versionA, versionB, expected]) => {
    it(`correctly compares ${versionA} and ${versionB}`, () => {
      expectNumber(compareVersion(versionA, versionB), expected);
    });
  });
});

describe('Date rounding', () => {
  const upper = '2070-01-18T12:46:43.011+01:00';
  const lower = '2070-01-18T12:46:12.011+01:00';
  const mid = '2070-01-18T12:46:30.000+01:00';
  const exact = '2070-01-18T12:46:00.000+01:00';

  const lang = Language.Norwegian;

  it('formatToClockOrRelativeMinutes rounds down', () => {
    const shouldRoundTo = '12:46';
    expectStringEqual(
      formatToClockOrRelativeMinutes(upper, lang, 'Now'),
      shouldRoundTo,
    );
    expectStringEqual(
      formatToClockOrRelativeMinutes(lower, lang, 'Now'),
      shouldRoundTo,
    );
    expectStringEqual(
      formatToClockOrRelativeMinutes(exact, lang, 'Now'),
      shouldRoundTo,
    );
  });

  it('fullDateTime rounds down', () => {
    const shouldRoundTo = '18. jan. 2070, 12:46';
    expectStringEqual(fullDateTime(upper, lang), shouldRoundTo);
    expectStringEqual(fullDateTime(lower, lang), shouldRoundTo);
    expectStringEqual(fullDateTime(exact, lang), shouldRoundTo);
  });

  it('formatToClock rounds down', () => {
    const shouldRoundTo = '12:46';
    expectStringEqual(formatToClock(upper, lang, 'floor'), shouldRoundTo);
    expectStringEqual(formatToClock(lower, lang, 'floor'), shouldRoundTo);
    expectStringEqual(formatToClock(exact, lang, 'floor'), shouldRoundTo);
  });

  it('formatToClock rounds down', () => {
    const shouldRoundTo = '12:46';
    expectStringEqual(formatToClock(upper, lang, 'floor'), shouldRoundTo);
    expectStringEqual(formatToClock(lower, lang, 'floor'), shouldRoundTo);
  });

  it('formatToClock rounds up', () => {
    const shouldRoundTo = '12:47';
    expectStringEqual(formatToClock(upper, lang, 'ceil'), shouldRoundTo);
    expectStringEqual(formatToClock(lower, lang, 'ceil'), shouldRoundTo);
  });

  it('formatToClock rounds to nearest', () => {
    expectStringEqual(formatToClock(upper, lang, 'round'), '12:47');
    expectStringEqual(formatToClock(lower, lang, 'round'), '12:46');
    expectStringEqual(formatToClock(mid, lang, 'round'), '12:47');
  });

  it('formatToClock stays exact', () => {
    const shouldRoundTo = '12:46';
    expectStringEqual(formatToClock(exact, lang, 'ceil'), shouldRoundTo);
    expectStringEqual(formatToClock(exact, lang, 'floor'), shouldRoundTo);
    expectStringEqual(formatToClock(exact, lang, 'round'), shouldRoundTo);
  });
});
