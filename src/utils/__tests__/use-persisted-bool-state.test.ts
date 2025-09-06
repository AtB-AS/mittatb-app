import {act, renderHook, waitFor} from '@testing-library/react-native';
import {usePersistedBoolState} from '@atb/utils/use-persisted-bool-state';
import type {StorageService} from '@atb/modules/storage';

const STORAGE_KEY = 'key1';

const createStorage = (initialValue?: string) =>
  ({
    get: jest.fn(() => Promise.resolve(initialValue || null)),
    set: jest.fn(() => Promise.resolve()),
  }) as any as StorageService;

describe('usePersistedBoolState', () => {
  it('should be false if initial state false and no value in storage', async () => {
    const storage = createStorage();
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, false),
    );

    expect(hook.result.current[0]).toBe(false);
    expect(storage.get).toHaveBeenCalledWith(STORAGE_KEY);

    await waitFor(() => expect(storage.get).toHaveReturned());
    expect(hook.result.current[0]).toBe(false);

    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(0);
  });

  it('should be true if initial state true and no value in storage', async () => {
    const storage = createStorage();
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, true),
    );

    expect(hook.result.current[0]).toBe(true);
    expect(storage.get).toHaveBeenCalledWith(STORAGE_KEY);

    await waitFor(() => expect(storage.get).toHaveReturned());
    expect(hook.result.current[0]).toBe(true);

    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(0);
  });

  it('should be true after update from storage', async () => {
    const storage = createStorage('true');
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, false),
    );

    expect(hook.result.current[0]).toBe(false);
    expect(storage.get).toHaveBeenCalledWith(STORAGE_KEY);

    await waitFor(() => expect(hook.result.current[0]).toBe(true));
    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(0);
  });

  it('should be false after update from storage', async () => {
    const storage = createStorage('false');
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, true),
    );

    expect(hook.result.current[0]).toBe(true);
    expect(storage.get).toHaveBeenCalledWith(STORAGE_KEY);

    await waitFor(() => expect(hook.result.current[0]).toBe(false));
    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(0);
  });

  it('setting true should give true as state and invoke storing the value', async () => {
    const storage = createStorage();
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, false),
    );

    const [_, setState] = hook.result.current;
    await act(async () => setState(true));

    expect(hook.result.current[0]).toBe(true);
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEY, 'true');

    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(1);
  });

  it('setting false should give false as state and invoke storing the value', async () => {
    const storage = createStorage('false');
    const hook = renderHook(() =>
      usePersistedBoolState(storage, STORAGE_KEY, false),
    );

    const [_, setState] = hook.result.current;
    await act(async () => setState(false));

    expect(hook.result.current[0]).toBe(false);
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEY, 'false');

    expect(storage.get).toHaveBeenCalledTimes(1);
    expect(storage.set).toHaveBeenCalledTimes(1);
  });
});
