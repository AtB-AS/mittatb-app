import {act, renderHook} from '@testing-library/react-native';
import {useDelayGate} from '@atb/utils/use-delay-gate';

describe('useDelayGate', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'clearTimeout');
    jest.clearAllTimers();
  });
  afterAll(() => jest.useRealTimers());

  it('Should give true after waiting the given delay', async () => {
    const hook = renderHook(() => useDelayGate(200));

    expect(hook.result.current).toBe(false);
    act(() => jest.advanceTimersByTime(195));
    expect(hook.result.current).toBe(false);
    act(() => jest.advanceTimersByTime(10));
    expect(hook.result.current).toBe(true);
  });

  it('Should give true after waiting the given delay, when explicitly enabled', () => {
    const hook = renderHook(() => useDelayGate(200, true));

    expect(hook.result.current).toBe(false);
    act(() => jest.advanceTimersByTime(205));
    expect(hook.result.current).toBe(true);
  });

  it('Should always give true if not enabled', () => {
    const hook = renderHook(() => useDelayGate(200, false));

    expect(hook.result.current).toBe(true);
    act(() => jest.advanceTimersByTime(205));
    expect(hook.result.current).toBe(true);
  });

  it('Should immediately change to true when it goes from enabled to disabled', () => {
    const hook = renderHook(
      ({enabled}: {enabled: boolean}) => useDelayGate(200, enabled),
      {
        initialProps: {enabled: true},
      },
    );

    expect(hook.result.current).toBe(false);
    hook.rerender({enabled: false});
    expect(hook.result.current).toBe(true);
  });

  it('Should restart the wait when it goes from disabled to enabled', () => {
    const hook = renderHook(
      ({enabled}: {enabled: boolean}) => useDelayGate(200, enabled),
      {
        initialProps: {enabled: false},
      },
    );

    expect(hook.result.current).toBe(true);
    hook.rerender({enabled: true});
    expect(hook.result.current).toBe(false);
    act(() => jest.advanceTimersByTime(205));
    expect(hook.result.current).toBe(true);
  });

  it('Should not have a stale value when it changes from enabled -> disabled -> enabled', () => {
    const hook = renderHook(
      ({enabled}: {enabled: boolean}) => useDelayGate(200, enabled),
      {
        initialProps: {enabled: true},
      },
    );

    expect(hook.result.current).toBe(false);
    act(() => jest.runOnlyPendingTimers());
    expect(hook.result.current).toBe(true);

    hook.rerender({enabled: false});
    expect(hook.result.current).toBe(true);

    hook.rerender({enabled: true});
    expect(hook.result.current).toBe(false); // Should start as false when re-enabled
    act(() => jest.runAllTimers());
    expect(hook.result.current).toBe(true); // Should become true after delay
  });

  it('Should clear timeouts', () => {
    const hook = renderHook(
      ({enabled}: {enabled: boolean}) => useDelayGate(200, enabled),
      {
        initialProps: {enabled: true},
      },
    );

    act(() => jest.advanceTimersByTime(50));
    hook.rerender({enabled: false}); // Should clear timeout
    act(() => jest.advanceTimersByTime(50));
    hook.rerender({enabled: true});
    hook.unmount(); // Should clear timeout

    expect(clearTimeout).toHaveBeenCalledTimes(2);
  });

  it('Should give true after new delay time when delay time is changed', () => {
    const hook = renderHook(
      ({delayTime}: {delayTime: number}) => useDelayGate(delayTime, true),
      {
        initialProps: {delayTime: 300},
      },
    );

    act(() => jest.advanceTimersByTime(50));
    expect(hook.result.current).toBe(false);
    hook.rerender({delayTime: 100});
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current).toBe(true);
  });
});
