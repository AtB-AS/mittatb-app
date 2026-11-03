import {useCallback, useEffect, useRef, useSyncExternalStore} from 'react';
import {type StorageService} from '@atb/modules/storage';

type Snapshot = {
  /** Whether a value has been read from storage or set by a hook */
  hasValue: boolean;
  value: unknown;
  /** Whether the read from storage has completed */
  isLoaded: boolean;
};

type Entry = {
  snapshot: Snapshot;
  listeners: Set<() => void>;
  loadStarted: boolean;
};

/**
 * Module level store, so all hooks using the same storage instance and key
 * share one value.
 */
const entriesByStorage = new WeakMap<StorageService, Map<string, Entry>>();

const getEntry = (storage: StorageService, storageKey: string): Entry => {
  let entries = entriesByStorage.get(storage);
  if (!entries) {
    entries = new Map();
    entriesByStorage.set(storage, entries);
  }
  let entry = entries.get(storageKey);
  if (!entry) {
    entry = {
      snapshot: {hasValue: false, value: undefined, isLoaded: false},
      listeners: new Set(),
      loadStarted: false,
    };
    entries.set(storageKey, entry);
  }
  return entry;
};

const updateSnapshot = (entry: Entry, update: Partial<Snapshot>) => {
  entry.snapshot = {...entry.snapshot, ...update};
  entry.listeners.forEach((listener) => listener());
};

const loadEntry = (
  entry: Entry,
  storage: StorageService,
  storageKey: string,
  deserialize: (stored: string) => unknown,
) => {
  if (entry.loadStarted) return;
  entry.loadStarted = true;
  storage
    .get(storageKey)
    .then((stored) => {
      // A value set while loading wins over the stored one
      if (entry.snapshot.hasValue || !stored) {
        updateSnapshot(entry, {isLoaded: true});
        return;
      }
      try {
        updateSnapshot(entry, {
          hasValue: true,
          value: deserialize(stored),
          isLoaded: true,
        });
      } catch {
        updateSnapshot(entry, {isLoaded: true});
      }
    })
    .catch(() => updateSnapshot(entry, {isLoaded: true}));
};

type Options<T> = {
  serialize?: (value: T) => string;
  deserialize?: (stored: string) => T;
};

/**
 * Like useState, but the value is persisted in the given storage, and shared
 * between all hooks using the same storage and key. Values are stored as JSON
 * by default.
 *
 * Until a value is read from storage or set, `initialState` is returned.
 * Stored values that can't be deserialized are ignored.
 *
 * @returns `[value, setValue, isLoaded]`, where `isLoaded` tells whether the
 * value has been read from storage.
 */
export const usePersistedState = <T>(
  storage: StorageService,
  storageKey: string,
  initialState: T,
  options?: Options<T>,
): [T, (value: T) => void, boolean] => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const subscribe = useCallback(
    (listener: () => void) => {
      const entry = getEntry(storage, storageKey);
      entry.listeners.add(listener);
      return () => {
        entry.listeners.delete(listener);
      };
    },
    [storage, storageKey],
  );

  const getSnapshot = useCallback(
    () => getEntry(storage, storageKey).snapshot,
    [storage, storageKey],
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    loadEntry(
      getEntry(storage, storageKey),
      storage,
      storageKey,
      optionsRef.current?.deserialize ?? JSON.parse,
    );
  }, [storage, storageKey]);

  const setValue = useCallback(
    (value: T) => {
      updateSnapshot(getEntry(storage, storageKey), {hasValue: true, value});
      const serialize = optionsRef.current?.serialize ?? JSON.stringify;
      storage.set(storageKey, serialize(value));
    },
    [storage, storageKey],
  );

  return [
    snapshot.hasValue ? (snapshot.value as T) : initialState,
    setValue,
    snapshot.isLoaded,
  ];
};
