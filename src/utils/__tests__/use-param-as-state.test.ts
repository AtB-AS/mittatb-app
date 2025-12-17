import {renderHook, act} from '@testing-library/react-native';
import {useParamAsState} from '../use-param-as-state';

const TEST_OBJECT = {val: 5};

describe('useParamAsState', () => {
  it('should initialize state with the provided param', () => {
    const {result} = renderHook(() => useParamAsState(5));
    expect(result.current[0]).toBe(5);
  });

  it('should work when param changes', () => {
    const {result, rerender} = renderHook(
      ({param}: {param: number | undefined}) => useParamAsState(param),
      {
        initialProps: {param: 5 as number | undefined},
      },
    );
    expect(result.current[0]).toBe(5);

    rerender({param: 10});
    expect(result.current[0]).toBe(10);

    rerender({param: 10});
    expect(result.current[0]).toBe(10);

    rerender({param: undefined});
    expect(result.current[0]).toBeUndefined();
  });

  it('should work with setState', () => {
    const {result} = renderHook(() => useParamAsState<number | undefined>(5));
    expect(result.current[0]).toBe(5);
    const setState = result.current[1];

    act(() => setState(10));
    expect(result.current[0]).toBe(10);

    act(() => setState(undefined));
    expect(result.current[0]).toBeUndefined();

    act(() => setState(8));
    expect(result.current[0]).toBe(8);
  });

  it('should work with both param change and setState', () => {
    const {result, rerender} = renderHook(
      ({param}: {param: number | undefined}) => useParamAsState(param),
      {
        initialProps: {param: 5 as number | undefined},
      },
    );
    expect(result.current[0]).toBe(5);
    const setState = result.current[1];

    rerender({param: 10});
    expect(result.current[0]).toBe(10);

    act(() => setState(undefined));
    expect(result.current[0]).toBeUndefined();

    rerender({param: 8});
    expect(result.current[0]).toBe(8);

    act(() => setState(3));
    expect(result.current[0]).toBe(3);
  });

  it('should by default update state if non-stable-reference even if equal', () => {
    const {result, rerender} = renderHook((param) => useParamAsState(param), {
      initialProps: TEST_OBJECT,
    });

    expect(result.current[0]).toBe(TEST_OBJECT);
    rerender({...TEST_OBJECT});
    expect(result.current[0]).not.toBe(TEST_OBJECT);
    expect(result.current[0]).toStrictEqual(TEST_OBJECT);
  });

  it('should not update state if equal non-stable-reference if checkEquality is true', () => {
    const {result, rerender} = renderHook(
      (param) => useParamAsState(param, true),
      {initialProps: TEST_OBJECT},
    );

    expect(result.current[0]).toBe(TEST_OBJECT);
    rerender({...TEST_OBJECT});
    expect(result.current[0]).toBe(TEST_OBJECT);
    expect(result.current[0]).toStrictEqual(TEST_OBJECT);
  });
});
