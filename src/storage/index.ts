import AsyncStorage from '@react-native-async-storage/async-storage';
import Bugsnag from '@bugsnag/react-native';

export type StorageModel = {
  stored_user_locations: string;
  '@ATB_user_departures': string;
  '@ATB_user_preferences': string;
  install_id: string;
  customer_id: string;
  '@ATB_onboarded': string;
  '@ATB_search-history': string;
  '@ATB_journey_search-history': string;
  '@ATB_ticket_informational_accepted': string;
  '@ATB_previous_build_number': string;
  '@ATB_saved_payment_methods': string;
  '@ATB_feedback_display_stats': string;
  '@ATB_last_mobile_token_user': string;
};

export type StorageModelTypes = keyof StorageModel;

const errorHandler = (error: any) => {
  Bugsnag.notify(typeof error === 'string' ? new Error(error) : error);
  return Promise.resolve(null);
};

const leaveBreadCrumb = (
  action: 'read-single' | 'save-single' | 'read-all',
  key?: string,
  value?: string | null,
) => {
  Bugsnag.leaveBreadcrumb('storage_action', {
    action,
    key,
    value: __DEV__ ? value : undefined,
  });
};

export type KeyValuePair = [string, string | null];

const storage = {
  get: async (key: string) => {
    const value = await AsyncStorage.getItem(key).catch(errorHandler);
    leaveBreadCrumb('read-single', key, value);
    return value;
  },
  set: async (key: string, value: string) => {
    leaveBreadCrumb('save-single', key, value);
    return AsyncStorage.setItem(key, value).catch(errorHandler);
  },
  getAll: async () => {
    leaveBreadCrumb('read-all');
    return AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiGet(keys))
      .catch(errorHandler);
  },
};

export default storage;
