import LegacyStorage from '@react-native-community/async-storage-backend-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';
import Bugsnag from '@bugsnag/react-native';

export type StorageModel = {
  stored_user_locations: string;
  '@ATB_user_departures': string;
  '@ATB_user_preferences': string;
  install_id: string;
  customer_id: string;
  onboarded: string;
  '@ATB_search-history': string;
  '@ATB_journey_search-history': string;
};

export type StorageModelTypes = keyof StorageModel;

const legacyStorage = new LegacyStorage();

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage, {
  errorHandler: (error) =>
    Bugsnag.notify(typeof error === 'string' ? new Error(error) : error),
  logger: (action) =>
    Bugsnag.leaveBreadcrumb('storage_action', {
      action: action.action,
      key: Array.isArray(action.key) ? action.key.join(',') : action.key,
    }),
});

export default storage;
