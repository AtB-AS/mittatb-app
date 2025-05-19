import AsyncStorage from '@react-native-async-storage/async-storage';
import Bugsnag from '@bugsnag/react-native';
import {Platform} from 'react-native';

export enum StorageModelKeysEnum {
  OneTimePopOver = '@ATB_one_time_popovers_seen',
  PreviousPaymentMethods = '@ATB_previous_payment_methods',
  ScooterConsent = '@ATB_scooter_consent',
}

type StorageModelKeysTypes = keyof typeof StorageModelKeysEnum;

export type StorageModel = {
  stored_user_locations: string;
  install_id: string;
  '@ATB_debug_token_server_ip_address': string;
  '@ATB_feedback_display_stats': string;
  '@ATB_journey_search-history': string;
  '@ATB_last_mobile_token_user': string;
  '@ATB_onboarded': string;
  '@ATB_one_time_popovers_seen': string;
  '@ATB_saved_payment_methods': string;
  '@ATB_search-history': string;
  '@ATB_user_departures': string;
  '@ATB_user_frontpage_departures': string;
  '@ATB_user_map_filters': string;
  '@ATB_user_preferences': string;
  '@ATB_user_travel_search_filters': string;
  '@ATB_user_travel_search_filters_v2': string;
  '@ATB_only_stop_places_checkbox': string;
};

export type StorageModelTypes = keyof StorageModel | StorageModelKeysTypes;

const errorHandler = (error: any) => {
  Bugsnag.notify(typeof error === 'string' ? new Error(error) : error);
  return Promise.resolve(null);
};

const leaveBreadCrumb = (
  action:
    | 'read-single'
    | 'save-single'
    | 'remove-single'
    | 'read-multi'
    | 'read-all',
  key?: string,
  value?: string | null,
) => {
  Bugsnag.leaveBreadcrumb('storage_action', {
    action,
    key,
    value,
  });
};

export type KeyValuePair = [string, string | null];

export const storage = {
  /** Necessary for communication between App and iOS Widget */
  setAppGroupName: async (groupName?: string) => {
    if (Platform.OS === 'ios') {
      await AsyncStorage.setAppGroupName(groupName).catch(errorHandler);
    }
  },
  get: async (key: string) => {
    const value = await AsyncStorage.getItem(key).catch(errorHandler);
    leaveBreadCrumb('read-single', key, value);
    return value;
  },
  set: async (key: string, value: string) => {
    leaveBreadCrumb('save-single', key, value);
    return AsyncStorage.setItem(key, value).catch(errorHandler);
  },
  remove: async (key: string) => {
    leaveBreadCrumb('remove-single', key);
    return AsyncStorage.removeItem(key).catch(errorHandler);
  },
  getMulti: async (keys: string[]) => {
    leaveBreadCrumb('read-multi');
    return AsyncStorage.multiGet(keys).catch(errorHandler);
  },
  getAll: async () => {
    leaveBreadCrumb('read-all');
    return AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiGet(keys))
      .catch(errorHandler);
  },
};

export type StorageService = typeof storage;
