import {useEffect} from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useStableProp} from '../use-stable-prop';

type TestProp = {a?: number; b?: number} | undefined;

describe('useStableProp', () => {
  it('should trigger useEffect only when prop is not deeply equal', () => {
    let prop: TestProp = {a: 1};
    const effectSpy = jest.fn();

    const useTestHook = (value: TestProp) => {
      const stableValue = useStableProp(value);
      useEffect(() => {
        effectSpy();
      }, [stableValue]);
      return stableValue;
    };

    const {rerender} = renderHook(({prop}) => useTestHook(prop), {
      initialProps: {prop},
    });

    expect(effectSpy).toHaveBeenCalledTimes(1); // Initial render

    act(() => {
      prop = {a: 1}; // new object with the same content
      rerender({prop});
    });

    expect(effectSpy).toHaveBeenCalledTimes(1); // No change, no effect call

    act(() => {
      prop = {a: 2};
      rerender({prop});
    });

    expect(effectSpy).toHaveBeenCalledTimes(2); // Changed, effect called

    act(() => {
      prop = {a: 2}; // new object with the same content
      rerender({prop});
    });

    expect(effectSpy).toHaveBeenCalledTimes(2); // No change, no effect call

    act(() => {
      prop = {b: 3};
      rerender({prop});
    });

    expect(effectSpy).toHaveBeenCalledTimes(3); // Changed, effect called
  });

  it('should return the initial prop value on initial render', () => {
    const initialProp: TestProp = {a: 1};
    const {result} = renderHook(() => useStableProp(initialProp));
    expect(result.current).toEqual(initialProp);
  });

  it('should update the stable value when the new prop is not deeply equal to the current prop', () => {
    let prop: TestProp = {a: 1};
    const {result, rerender} = renderHook(() => useStableProp(prop));

    act(() => {
      prop = {a: 2};
      rerender(prop);
    });

    expect(result.current).toEqual({a: 2});

    act(() => {
      prop = {b: 3};
      rerender(prop);
    });

    expect(result.current).toEqual({b: 3});
  });

  it('should not update the stable value when the new prop is deeply equal to the current prop', () => {
    let prop: TestProp = {a: 1};
    const {result, rerender} = renderHook(() => useStableProp(prop));

    act(() => {
      prop = {a: 1}; // new object with the same content
      rerender(prop);
    });

    expect(result.current).toEqual({a: 1});

    act(() => {
      prop = {a: 2}; // change content
      rerender(prop);
    });

    expect(result.current).toEqual({a: 2});
  });

  it('should handle undefined initial prop value', () => {
    const initialProp = undefined;
    const {result} = renderHook(() => useStableProp(initialProp));
    expect(result.current).toBeUndefined();
  });

  it('should update the stable value from undefined to a defined value', () => {
    let prop: TestProp = undefined;
    const {result, rerender} = renderHook(() => useStableProp(prop));

    expect(result.current).toBeUndefined();

    act(() => {
      prop = {a: 1};
      rerender(prop);
    });

    expect(result.current).toEqual({a: 1});
  });

  it('should update the stable value from a defined value to undefined', () => {
    let prop: TestProp = {a: 1};
    const {result, rerender} = renderHook(() => useStableProp(prop));

    expect(result.current).toEqual({a: 1});

    act(() => {
      prop = undefined;
      rerender(prop);
    });

    expect(result.current).toBeUndefined();
  });
});
