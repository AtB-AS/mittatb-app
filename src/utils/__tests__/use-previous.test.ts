import {renderHook} from '@testing-library/react-hooks';
import {usePrevious} from '../use-previous';

describe('usePrevious', () => {
  it('should return undefined on initial render', () => {
    const {result} = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it('should return the previous value after update', () => {
    const {result, rerender} = renderHook((value) => usePrevious(value), {
      initialProps: 0,
    });

    rerender(1);
    expect(result.current).toBe(0);

    rerender(2);
    expect(result.current).toBe(1);
  });

  it('should not update previous value if current value does not change', () => {
    const {result, rerender} = renderHook((value) => usePrevious(value), {
      initialProps: {a: 1},
    });

    rerender({a: 1}); // new object with the same content
    expect(result.current).toBeUndefined();

    rerender({a: 2}); // change content
    expect(result.current).toEqual({a: 1});
  });
});
