import LegacyStorage from '@react-native-community/async-storage-backend-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';
import bugsnag from '../diagnostics/bugsnag';

type StorageModel = {
  stored_user_locations: string;
  install_id: string;
  onboarded: string;
  '@ATB_search-history': string;
};

const legacyStorage = new LegacyStorage();

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage, {
  errorHandler: (error) =>
    bugsnag.notify(typeof error === 'string' ? new Error(error) : error),
  logger: (action) =>
    bugsnag.leaveBreadcrumb('storage_action', {
      action: action.action,
      key: Array.isArray(action.key) ? action.key.join(',') : action.key,
    }),
});

export default storage;
