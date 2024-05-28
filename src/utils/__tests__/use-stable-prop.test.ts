import {renderHook, act} from '@testing-library/react-hooks';
import {useStableProp} from '../use-stable-prop';

type TestProp = {a?: number; b?: number} | undefined;

describe('useStableProp', () => {
  it('should trigger useEffect only when prop is not deeply equal', () => {
    const prop1 = {a: 1};
    const prop2 = {a: 1};

    const {result, rerender} = renderHook((prop) => useStableProp(prop), {
      initialProps: prop1,
    });

    expect(result.current).toBe(prop1);

    rerender(prop2);
    expect(result.current).toBe(prop1);
    expect(result.current).not.toBe(prop2);
  });

  it('should return the initial prop value on initial render', () => {
    const initialProp: TestProp = {a: 1};
    const {result} = renderHook(() => useStableProp(initialProp));
    expect(result.current).toEqual(initialProp);
  });

  it('should update the stable value when the new prop is not deeply equal to the current prop', () => {
    const {result, rerender} = renderHook(
      (prop: TestProp) => useStableProp(prop),
      {
        initialProps: {a: 1},
      },
    );

    rerender({a: 2});
    expect(result.current).toEqual({a: 2});

    rerender({b: 3});
    expect(result.current).toEqual({b: 3});
  });

  it('should not update the stable value when the new prop is deeply equal to the current prop', () => {
    const initialProp: TestProp = {a: 1};
    const {result, rerender} = renderHook(
      (prop: TestProp) => useStableProp(prop),
      {
        initialProps: initialProp,
      },
    );

    rerender({a: 1}); // new object with the same content
    expect(result.current).toEqual(initialProp);

    rerender({a: 2}); // change content
    expect(result.current).toEqual({a: 2});
  });

  it('should update the stable value from undefined to a defined value', () => {
    const initialProp = undefined;
    const {result, rerender} = renderHook(
      (prop: TestProp) => useStableProp(prop),
      {
        initialProps: initialProp,
      },
    );

    expect(result.current).toBeUndefined();

    rerender({a: 1});
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
