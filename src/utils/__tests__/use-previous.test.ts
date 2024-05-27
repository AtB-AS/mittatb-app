import {renderHook, act} from '@testing-library/react-hooks';
import {usePrevious} from '../use-previous';

describe('usePrevious', () => {
  it('should return undefined on initial render', () => {
    const {result} = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it('should return the previous value after update', () => {
    let value = 0;
    const {result, rerender} = renderHook(() => usePrevious(value));

    act(() => {
      value = 1;
      rerender();
    });

    expect(result.current).toBe(0);

    act(() => {
      value = 2;
      rerender();
    });

    expect(result.current).toBe(1);
  });

  it('should not update previous value if current value does not change', () => {
    let value = {a: 1};
    const {result, rerender} = renderHook(() => usePrevious(value));

    act(() => {
      value = {a: 1}; // new object with the same content
      rerender();
    });

    expect(result.current).toBeUndefined();

    act(() => {
      value = {a: 2}; // change content
      rerender();
    });

    expect(result.current).toEqual({a: 1});
  });
});
