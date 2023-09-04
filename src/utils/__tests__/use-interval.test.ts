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

  it('should invoke with specified delay', async () => {
    const delay = 300;
    renderHook(() => useInterval(callback, delay));
    expect(callback).toHaveBeenCalledTimes(0);

    await advanceByTimer(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
  });

  it('should invoke with specified delay and immediate if set', async () => {
    const delay = 300;
    renderHook(() => useInterval(callback, delay, [], false, true));
    expect(callback).toHaveBeenCalledTimes(1);

    // This is needed to make timers move passed by promises.
    await resolvePromiseEnforceStep();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);

    await runPendingTimers();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not have less than 100ms delay', async () => {
    const minimumDelay = 100;
    renderHook(() => useInterval(callback, 0));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      minimumDelay,
    );
    await nextTimerTick();

    expect(callback).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      minimumDelay,
    );

    await runPendingTimers();
    expect(callback).toBeCalledTimes(2);
  });
});

async function advanceByTimer(time: number) {
  jest.advanceTimersByTime(time);
  // This is a workaround for fake timers in jest to support async code
  // as useInterval supports promises.
  // See https://stackoverflow.com/questions/52177631/jest-timer-and-promise-dont-work-well-settimeout-and-async-function
  await resolvePromiseEnforceStep();
}

async function nextTimerTick() {
  jest.advanceTimersToNextTimer();
  // This is a workaround for fake timers in jest to support async code
  // as useInterval supports promises.
  // See https://stackoverflow.com/questions/52177631/jest-timer-and-promise-dont-work-well-settimeout-and-async-function
  await resolvePromiseEnforceStep();
}

async function runPendingTimers() {
  jest.runOnlyPendingTimers();
  // This is a workaround for fake timers in jest to support async code
  // as useInterval supports promises.
  // See https://stackoverflow.com/questions/52177631/jest-timer-and-promise-dont-work-well-settimeout-and-async-function
  await resolvePromiseEnforceStep();
}

async function resolvePromiseEnforceStep() {
  await Promise.resolve();
}
