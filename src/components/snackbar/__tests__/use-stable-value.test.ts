import {renderHook, act} from '@testing-library/react-native';
import {useStableValue} from '../use-stable-value';

type TestValue = {a?: number; b?: number} | undefined;

describe('useStableValue', () => {
  it('should trigger useEffect only when value is not deeply equal', () => {
    const value1 = {a: 1};
    const value2 = {a: 1};

    const {result, rerender} = renderHook((value) => useStableValue(value), {
      initialProps: value1,
    });

    expect(result.current).toBe(value1);

    rerender(value2);
    expect(result.current).toBe(value1);
    expect(result.current).not.toBe(value2);
  });

  it('should return the initial value value on initial render', () => {
    const initialValue: TestValue = {a: 1};
    const {result} = renderHook(() => useStableValue(initialValue));
    expect(result.current).toEqual(initialValue);
  });
  it('should update the stable value when the new value is not deeply equal to the current value', () => {
    const {result, rerender} = renderHook(
      (value: TestValue) => useStableValue(value),
      {
        initialProps: {a: 1},
      },
    );

    rerender({a: 2});
    expect(result.current).toEqual({a: 2});

    rerender({b: 3} as any);
    expect(result.current).toEqual({b: 3});
  });

  it('should not update the stable value when the new value is deeply equal to the current value', () => {
    const initialValue: TestValue = {a: 1};
    const {result, rerender} = renderHook(
      (value: TestValue) => useStableValue(value),
      {
        initialProps: initialValue,
      },
    );

    rerender({a: 1}); // new object with the same content
    expect(result.current).toEqual(initialValue);

    rerender({a: 2}); // change content
    expect(result.current).toEqual({a: 2});
  });

  it('should not update the stable value when lockValue is true', () => {
    let lockValue = true;
    const initialValue: TestValue = {a: 1};
    const {result, rerender} = renderHook(
      ({value, lockValue}: {value: TestValue; lockValue: boolean}) =>
        useStableValue(value, lockValue),
      {
        initialProps: {value: initialValue, lockValue},
      },
    );

    rerender({value: {a: 1}, lockValue}); // new object with the same content
    expect(result.current).toEqual(initialValue);

    rerender({value: {a: 2}, lockValue}); // change content
    expect(result.current).toEqual(initialValue); // but shouldnt change since lockValue is true

    rerender({value: {a: 2}, lockValue}); // change content
    expect(result.current).toEqual(initialValue); // but shouldnt change since lockValue is true

    lockValue = false;
    rerender({value: {a: 3}, lockValue}); // change content
    expect(result.current).toEqual({a: 3}); // should change again since lockValue is false now
  });

  it('should update the stable value from undefined to a defined value', () => {
    const initialValue = undefined;
    const {result, rerender} = renderHook(
      (value: TestValue) => useStableValue(value),
      {
        initialProps: initialValue,
      },
    );

    expect(result.current).toBeUndefined();

    rerender({a: 1});
    expect(result.current).toEqual({a: 1});
  });

  it('should update the stable value from a defined value to undefined', () => {
    let value: TestValue = {a: 1};
    const {result, rerender} = renderHook(() => useStableValue(value));

    expect(result.current).toEqual({a: 1});

    act(() => {
      value = undefined;
      rerender(value);
    });

    expect(result.current).toBeUndefined();
  });
});
