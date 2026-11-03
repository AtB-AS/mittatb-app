import {act, renderHook, waitFor} from '@testing-library/react-native';
import {usePersistedState} from '@atb/utils/use-persisted-state';
import type {StorageService} from '@atb/modules/storage';

const STORAGE_KEY = 'key1';

const createStorage = (initialValue?: string) =>
  ({
    get: jest.fn(() => Promise.resolve(initialValue || null)),
    set: jest.fn(() => Promise.resolve()),
  }) as any as StorageService;

/** Storage where the read only resolves when `resolveGet` is called */
const createDeferredStorage = () => {
  let resolveGet: (value: string | null) => void = () => {};
  const storage = {
    get: jest.fn(
      () =>
        new Promise<string | null>((resolve) => {
          resolveGet = resolve;
        }),
    ),
    set: jest.fn(() => Promise.resolve()),
  } as any as StorageService;
  return {storage, resolveGet: (value: string | null) => resolveGet(value)};
};

describe('usePersistedState', () => {
  it('should read legacy boolean strings', async () => {
    const storage = createStorage('true');
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );
    await waitFor(() => expect(hook.result.current[0]).toBe(true));

    const storage2 = createStorage('false');
    const hook2 = renderHook(() =>
      usePersistedState(storage2, STORAGE_KEY, true),
    );
    await waitFor(() => expect(hook2.result.current[0]).toBe(false));
  });

  it('should report isLoaded when storage has been read', async () => {
    const {storage, resolveGet} = createDeferredStorage();
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );

    expect(hook.result.current[2]).toBe(false);
    await act(async () => resolveGet(null));
    expect(hook.result.current[2]).toBe(true);
    expect(hook.result.current[0]).toBe(false);
  });

  it('should share value between hooks with same storage and key', async () => {
    const storage = createStorage();
    const hook1 = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );
    const hook2 = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );
    const otherKeyHook = renderHook(() =>
      usePersistedState(storage, 'otherKey', false),
    );
    await waitFor(() => expect(hook2.result.current[2]).toBe(true));

    await act(async () => hook1.result.current[1](true));

    expect(hook1.result.current[0]).toBe(true);
    expect(hook2.result.current[0]).toBe(true);
    expect(otherKeyHook.result.current[0]).toBe(false);
    expect(storage.get).toHaveBeenCalledTimes(2); // Once per key
  });

  it('should not share value between storage instances', async () => {
    const storage1 = createStorage();
    const storage2 = createStorage();
    const hook1 = renderHook(() =>
      usePersistedState(storage1, STORAGE_KEY, false),
    );
    const hook2 = renderHook(() =>
      usePersistedState(storage2, STORAGE_KEY, false),
    );

    await act(async () => hook1.result.current[1](true));

    expect(hook1.result.current[0]).toBe(true);
    expect(hook2.result.current[0]).toBe(false);
  });

  it('should let a value set while loading win over the stored value', async () => {
    const {storage, resolveGet} = createDeferredStorage();
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );

    await act(async () => hook.result.current[1](true));
    expect(hook.result.current[0]).toBe(true);
    expect(hook.result.current[2]).toBe(false);

    await act(async () => resolveGet('false'));
    expect(hook.result.current[0]).toBe(true);
    expect(hook.result.current[2]).toBe(true);
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEY, 'true');
  });

  it('should keep setValue stable between renders', async () => {
    const storage = createStorage();
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );
    const setValue = hook.result.current[1];

    await act(async () => setValue(true));

    expect(hook.result.current[1]).toBe(setValue);
  });

  it('should store and read non-boolean types as JSON', async () => {
    type Value = {ids: string[]; count: number};
    const initial: Value = {ids: [], count: 0};

    const storage = createStorage(JSON.stringify({ids: ['a'], count: 1}));
    const hook = renderHook(() =>
      usePersistedState<Value>(storage, STORAGE_KEY, initial),
    );
    expect(hook.result.current[0]).toBe(initial);
    await waitFor(() =>
      expect(hook.result.current[0]).toEqual({ids: ['a'], count: 1}),
    );

    await act(async () => hook.result.current[1]({ids: ['b', 'c'], count: 2}));

    expect(hook.result.current[0]).toEqual({ids: ['b', 'c'], count: 2});
    expect(storage.set).toHaveBeenCalledWith(
      STORAGE_KEY,
      '{"ids":["b","c"],"count":2}',
    );
  });

  it('should use custom serialize and deserialize', async () => {
    const storage = createStorage('1,2');
    const hook = renderHook(() =>
      usePersistedState<number[]>(storage, STORAGE_KEY, [], {
        serialize: (v) => v.join(','),
        deserialize: (s) => s.split(',').map(Number),
      }),
    );
    await waitFor(() => expect(hook.result.current[0]).toEqual([1, 2]));

    await act(async () => hook.result.current[1]([3]));

    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEY, '3');
  });

  it('should fall back to initial state if stored value is invalid JSON', async () => {
    const storage = createStorage('not json');
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, 'initial'),
    );

    await waitFor(() => expect(hook.result.current[2]).toBe(true));
    expect(hook.result.current[0]).toBe('initial');
  });

  it('should be loaded even if reading from storage fails', async () => {
    const storage = {
      get: jest.fn(() => Promise.reject(new Error('fail'))),
      set: jest.fn(() => Promise.resolve()),
    } as any as StorageService;
    const hook = renderHook(() =>
      usePersistedState(storage, STORAGE_KEY, false),
    );

    await waitFor(() => expect(hook.result.current[2]).toBe(true));
    expect(hook.result.current[0]).toBe(false);
  });
});
