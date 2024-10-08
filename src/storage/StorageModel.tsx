import AsyncStorage from '@react-native-async-storage/async-storage';
import Bugsnag from '@bugsnag/react-native';
import {Platform} from 'react-native';

export enum StorageModelKeysEnum {
  EnableActivateTicketNowDebugOverride = '@ATB_enable_activate_ticket_now_debug_override',
  EnableBackendSmsAuth = '@ATB_backend_sms_auth',
  EnableBeaconsDebugOverride = '@ATB_beacons_debug_override',
  EnableCarSharingInMapDebugOverride = 'ATB_enable_car_sharing_in_map_debug_override',
  EnableCityBikesInMapDebugOverride = 'ATB_enable_city_bikes_in_map_debug_override',
  EnableFlexibleTransportDebugOverride = '@ATB_enable_flexible_transport',
  EnableFromTravelSearchToTicketDebugOverride = '@ATB_enable_from_travel_search_to_ticket_debug_override',
  EnableFromTravelSearchToTicketBoatDebugOverride = '@ATB_enable_from_travel_search_to_ticket_boat_debug_override',
  EnableGeofencingZonesDebugOverride = '@ATB_enable_geofencing_zones_debug_override',
  EnableLoadingScreenDebugOverride = '@ATB_loading_screen_debug_override',
  EnableLoadingErrorScreenDebugOverride = '@ATB_loading_error_screen_debug_override',
  EnableNonTransitTripSearch = '@ATB_enable_non_transit_trip_search',
  EnableOnBehalfOfDebugOverride = '@ATB_enable_on_behalf_of_debug_override',
  EnableParkingViolationsReportingDebugOverride = '@ATB_enable_parking_violations_debug_override',
  EnablePosthogDebugOverride = '@ATB_enable_posthog_debug_override',
  EnablePushNotificationsDebugOverride = '@ATB_enable_push_notifications_debug_override',
  EnableRealtimeMapDebugOverride = '@ATB_enable_realtime_map_debug_override',
  EnableServerTimeDebugOverride = '@ATB_server_time_debug_override',
  EnableTicketInformationDebugOverride = '@ATB_enable_ticket_information_debug_override',
  EnableTicketingAssistantOverride = '@ATB_enable_ticketing_assistant_override',
  EnableTipsAndInformationOverride = '@ATB_enable_tips_and_information_override',
  EnableTravelAid = '@ATB_enable_travel_aid_debug_override',
  EnableTravelAidStopButton = '@ATB_enable_travel_aid_stop_button_debug_override',
  EnableVehiclesInMapDebugOverride = '@ATB_enable_vehicles_in_map_debug_override',
  EnableSaveTicketRecipientsDebugOverride = '@ATB_enable_save_ticket_recipients_debug_override',
  EnableShmoDeepIntegrationDebugOverride = '@ATB_enable_shmo_deep_integration_debug_override',
  EnableOnlyStopPlacesCheckboxDebugOverride = '@ATB_enable_only_stop_places_checkbox_debug_override',
  OneTimePopOver = '@ATB_one_time_popovers_seen',
  ShowValidTimeInfoDebugOverride = '@ATB_show_valid_time_info_debug_override',
  UseFlexibleTransportAccessModeDebugOverride = '@ATB_use_flexible_on_accessMode',
  UseFlexibleTransportDirectModeDebugOverride = '@ATB_use_flexible_on_directMode',
  UseFlexibleTransportEgressModeDebugOverride = '@ATB_use_flexible_on_egressMode',
}

type StorageModelKeysTypes = keyof typeof StorageModelKeysEnum;

export type StorageModel = {
  stored_user_locations: string;
  install_id: string;
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
};

export type StorageModelTypes = keyof StorageModel | StorageModelKeysTypes;

const errorHandler = (error: any) => {
  Bugsnag.notify(typeof error === 'string' ? new Error(error) : error);
  return Promise.resolve(null);
};

const leaveBreadCrumb = (
  action: 'read-single' | 'save-single' | 'remove-single' | 'read-all',
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
  getAll: async () => {
    leaveBreadCrumb('read-all');
    return AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiGet(keys))
      .catch(errorHandler);
  },
};
