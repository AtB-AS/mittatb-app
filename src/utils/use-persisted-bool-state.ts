import {type StorageService} from '@atb/modules/storage';
import {usePersistedState} from './use-persisted-state';

/**
 * Booleans are stored as 'true' and 'false', which is also their JSON
 * representation, so this is compatible with previously stored values.
 */
export const usePersistedBoolState = (
  storage: StorageService,
  storageKey: string,
  initialState: boolean,
) => usePersistedState<boolean>(storage, storageKey, initialState);
