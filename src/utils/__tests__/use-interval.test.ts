import {renderHook} from '@testing-library/react-hooks';
import {useInterval} from '../use-interval';

describe('useInterval', () => {
  let callback = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    callback.mockRestore();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should invoke with specified delay', () => {
    const {result} = renderHook(() => useInterval(callback, 300));

    expect(result.current).toBeUndefined();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it.only('should invoke with specified delay and immediate if set', () => {
    const {result} = renderHook(
      // () => useInterval(callback, 300),
      () => useInterval(callback, 300, [], false, true),
    );
    jest.runOnlyPendingTimers();

    expect(result.current).toBeUndefined();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not have less than 100ms delay', () => {
    const {result} = renderHook(() => useInterval(callback, 0));
    jest.advanceTimersByTime(100);

    expect(result.current).toBeUndefined();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
  });
});
