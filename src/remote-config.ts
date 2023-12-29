import remoteConfig from '@react-native-firebase/remote-config';
import {ENABLE_TICKETING, PRIVACY_POLICY_URL, CUSTOMER_SERVICE_URL} from '@env';

export type RemoteConfig = {
  enable_ticketing: boolean;
  enable_intercom: boolean;
  feedback_questions: string;
  must_upgrade_ticketing: boolean;
  customer_service_url: string;
  customer_feedback_url: string;
  tripsSearch_target_number_of_initial_hits: number;
  tripsSearch_target_number_of_page_hits: number;
  tripsSearch_max_number_of_chained_searches: number;
  privacy_policy_url: string;
  service_disruption_url: string;
  enable_token_fallback: boolean;
  enable_token_fallback_on_timeout: boolean;
  enable_flex_tickets: boolean;
  flex_ticket_url: string;
  flex_booking_number_of_days_available: number;
  enable_vipps_login: boolean;
  favourite_departures_poll_interval: number;
  new_favourites_info_url: string;
  enable_from_travel_search_to_ticket: boolean;
  enable_vehicles_in_map: boolean;
  vehicles_poll_interval: number;
  enable_city_bikes_in_map: boolean;
  enable_car_sharing_in_map: boolean;
  enable_vehicle_operator_logo: boolean;
  default_map_filter: string;
  enable_realtime_map: boolean;
  enable_ticketing_assistant: boolean;
  enable_tips_and_information: boolean;
  enable_flexible_transport: boolean;
  use_flexible_on_accessMode: boolean;
  use_flexible_on_directMode: boolean;
  use_flexible_on_egressMode: boolean;
  use_trygg_overgang_qr_code: boolean;
  disable_travelcard: boolean;
  live_vehicle_stale_threshold: number;
  enable_extended_onboarding: boolean;
  enable_non_transit_trip_search: boolean;
  enable_show_valid_time_info: boolean;
  enable_loading_screen: boolean;
  enable_loading_error_screen: boolean;
  token_timeout_in_seconds: number;
  enable_beacons: boolean;
  delay_share_travel_habits_screen_by_sessions_count: number;
  enable_parking_violations_reporting: boolean;
  enable_push_notifications: boolean;
  enable_on_behalf_of: boolean;
  enable_ticket_information: boolean;
  enable_posthog: boolean;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_ticketing: !!JSON.parse(ENABLE_TICKETING || 'false'),
  enable_intercom: true,
  feedback_questions: '',
  must_upgrade_ticketing: false,
  customer_service_url: CUSTOMER_SERVICE_URL,
  customer_feedback_url: '',
  tripsSearch_target_number_of_initial_hits: 8,
  tripsSearch_target_number_of_page_hits: 8,
  tripsSearch_max_number_of_chained_searches: 5,
  privacy_policy_url: PRIVACY_POLICY_URL,
  service_disruption_url: '',
  enable_token_fallback: true,
  enable_token_fallback_on_timeout: true,
  enable_flex_tickets: false,
  flex_ticket_url: '',
  flex_booking_number_of_days_available: 7,
  enable_vipps_login: false,
  favourite_departures_poll_interval: 30000,
  new_favourites_info_url: '',
  enable_from_travel_search_to_ticket: false,
  enable_vehicles_in_map: false,
  vehicles_poll_interval: 20000,
  enable_city_bikes_in_map: false,
  enable_car_sharing_in_map: false,
  enable_vehicle_operator_logo: false,
  default_map_filter: JSON.stringify({
    vehicles: {
      showVehicles: false,
    },
  }),
  enable_realtime_map: false,
  enable_ticketing_assistant: false,
  enable_tips_and_information: false,
  enable_flexible_transport: false,
  use_flexible_on_accessMode: true,
  use_flexible_on_directMode: true,
  use_flexible_on_egressMode: true,
  use_trygg_overgang_qr_code: false,
  live_vehicle_stale_threshold: 15,
  enable_extended_onboarding: false,
  disable_travelcard: false,
  enable_non_transit_trip_search: true,
  enable_show_valid_time_info: true,
  enable_loading_screen: true,
  enable_loading_error_screen: false,
  token_timeout_in_seconds: 10,
  enable_beacons: false,
  delay_share_travel_habits_screen_by_sessions_count: 0,
  enable_parking_violations_reporting: false,
  enable_push_notifications: false,
  enable_on_behalf_of: false,
  enable_ticket_information: false,
  enable_posthog: false,
};

export type RemoteConfigKeys = keyof RemoteConfig;

export function getConfig(): RemoteConfig {
  const values = remoteConfig().getAll();
  const enable_ticketing = values['enable_ticketing']?.asBoolean() ?? false;
  const enable_intercom = values['enable_intercom']?.asBoolean() ?? true;
  const enable_flex_tickets =
    values['enable_flex_tickets']?.asBoolean() ??
    defaultRemoteConfig.enable_flex_tickets;
  const flex_ticket_url =
    values['flex_ticket_url']?.asString() ??
    defaultRemoteConfig.flex_ticket_url;
  const flex_booking_number_of_days_available =
    values['flex_booking_number_of_days_available']?.asNumber() ??
    defaultRemoteConfig.flex_booking_number_of_days_available;
  const feedback_questions =
    values['feedback_questions']?.asString() ??
    defaultRemoteConfig.feedback_questions;
  const must_upgrade_ticketing =
    values['must_upgrade_ticketing']?.asBoolean() ?? false;
  const customer_service_url =
    values['customer_service_url']?.asString() ??
    defaultRemoteConfig.customer_service_url;
  const customer_feedback_url =
    values['customer_feedback_url']?.asString() ??
    defaultRemoteConfig.customer_feedback_url;
  const tripsSearch_target_number_of_initial_hits =
    values['tripsSearch_target_number_of_initial_hits']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_target_number_of_initial_hits;
  const tripsSearch_target_number_of_page_hits =
    values['tripsSearch_target_number_of_page_hits']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_target_number_of_page_hits;
  const tripsSearch_max_number_of_chained_searches =
    values['tripsSearch_max_number_of_chained_searches']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_max_number_of_chained_searches;

  const privacy_policy_url =
    values['privacy_policy_url']?.asString() ??
    defaultRemoteConfig.privacy_policy_url;

  const service_disruption_url =
    values['service_disruption_url']?.asString() ??
    defaultRemoteConfig.service_disruption_url;

  const enable_token_fallback =
    values['enable_token_fallback']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback;

  const enable_token_fallback_on_timeout =
    values['enable_token_fallback_on_timeout']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback_on_timeout;

  const enable_vipps_login =
    values['enable_vipps_login']?.asBoolean() ??
    defaultRemoteConfig.enable_vipps_login;

  const favourite_departures_poll_interval =
    values['favourite_departures_poll_interval']?.asNumber() ??
    defaultRemoteConfig.favourite_departures_poll_interval;

  const new_favourites_info_url =
    values['new_favourites_info_url']?.asString() ??
    defaultRemoteConfig.new_favourites_info_url;

  const enable_from_travel_search_to_ticket =
    values['enable_from_travel_search_to_ticket']?.asBoolean() ??
    defaultRemoteConfig.enable_from_travel_search_to_ticket;

  const enable_vehicles_in_map =
    values['enable_vehicles_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicles_in_map;

  const vehicles_poll_interval =
    values['vehicles_poll_interval']?.asNumber() ??
    defaultRemoteConfig.vehicles_poll_interval;

  const enable_city_bikes_in_map =
    values['enable_city_bikes_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_city_bikes_in_map;

  const enable_car_sharing_in_map =
    values['enable_car_sharing_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_car_sharing_in_map;

  const enable_vehicle_operator_logo =
    values['enable_vehicle_operator_logo']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicle_operator_logo;

  const default_map_filter =
    values['default_map_filter']?.asString() ??
    defaultRemoteConfig.default_map_filter;

  const enable_realtime_map =
    values['enable_realtime_map']?.asBoolean() ??
    defaultRemoteConfig.enable_realtime_map;

  const enable_ticketing_assistant =
    values['enable_ticketing_assistant']?.asBoolean() ??
    defaultRemoteConfig.enable_ticketing_assistant;

  const enable_tips_and_information =
    values['enable_tips_and_information']?.asBoolean() ??
    defaultRemoteConfig.enable_tips_and_information;

  const enable_flexible_transport =
    values['enable_flexible_transport']?.asBoolean() ??
    defaultRemoteConfig.enable_flexible_transport;

  const use_flexible_on_accessMode =
    values['use_flexible_on_accessMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_accessMode;

  const use_flexible_on_directMode =
    values['use_flexible_on_directMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_directMode;

  const use_flexible_on_egressMode =
    values['use_flexible_on_egressMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_egressMode;

  const use_trygg_overgang_qr_code =
    values['use_trygg_overgang_qr_code']?.asBoolean() ??
    defaultRemoteConfig.use_trygg_overgang_qr_code;

  const disable_travelcard =
    values['disable_travelcard']?.asBoolean() ??
    defaultRemoteConfig.disable_travelcard;

  const live_vehicle_stale_threshold =
    values['live_vehicle_stale_threshold']?.asNumber() ??
    defaultRemoteConfig.live_vehicle_stale_threshold;

  const enable_extended_onboarding =
    values['enable_extended_onboarding']?.asBoolean() ??
    defaultRemoteConfig.enable_extended_onboarding;

  const enable_non_transit_trip_search =
    values['enable_non_transit_trip_search']?.asBoolean() ??
    defaultRemoteConfig.enable_non_transit_trip_search;

  const enable_show_valid_time_info =
    values['enable_show_valid_time_info']?.asBoolean() ??
    defaultRemoteConfig.enable_show_valid_time_info;

  const enable_loading_screen =
    values['enable_loading_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_screen;

  const enable_loading_error_screen =
    values['enable_loading_error_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_error_screen;

  const token_timeout_in_seconds =
    values['token_timeout_in_seconds']?.asNumber() ??
    defaultRemoteConfig.token_timeout_in_seconds;

  const enable_beacons =
    values['enable_beacons']?.asBoolean() ?? defaultRemoteConfig.enable_beacons;

  const delay_share_travel_habits_screen_by_sessions_count =
    values['delay_share_travel_habits_screen_by_sessions_count']?.asNumber() ??
    defaultRemoteConfig.delay_share_travel_habits_screen_by_sessions_count;
  const enable_parking_violations_reporting =
    values['enable_parking_violations_reporting']?.asBoolean() ??
    defaultRemoteConfig.enable_parking_violations_reporting;

  const enable_push_notifications =
    values['enable_push_notifications']?.asBoolean() ??
    defaultRemoteConfig.enable_push_notifications;

  const enable_on_behalf_of =
    values['enable_on_behalf_of']?.asBoolean() ??
    defaultRemoteConfig.enable_on_behalf_of;

  const enable_ticket_information =
    values['enable_ticket_information']?.asBoolean() ??
    defaultRemoteConfig.enable_ticket_information;

  const enable_posthog =
    values['enable_posthog']?.asBoolean() ?? defaultRemoteConfig.enable_posthog;

  return {
    enable_ticketing,
    enable_intercom,
    feedback_questions,
    must_upgrade_ticketing,
    customer_service_url,
    customer_feedback_url,
    tripsSearch_target_number_of_initial_hits,
    tripsSearch_target_number_of_page_hits,
    tripsSearch_max_number_of_chained_searches,
    privacy_policy_url,
    service_disruption_url,
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    enable_flex_tickets,
    flex_ticket_url,
    flex_booking_number_of_days_available,
    enable_vipps_login,
    favourite_departures_poll_interval,
    new_favourites_info_url,
    enable_from_travel_search_to_ticket,
    enable_vehicles_in_map,
    vehicles_poll_interval,
    enable_city_bikes_in_map,
    enable_car_sharing_in_map,
    enable_vehicle_operator_logo,
    default_map_filter,
    enable_realtime_map,
    enable_ticketing_assistant,
    enable_tips_and_information,
    enable_flexible_transport,
    use_flexible_on_accessMode,
    use_flexible_on_directMode,
    use_flexible_on_egressMode,
    use_trygg_overgang_qr_code,
    disable_travelcard,
    live_vehicle_stale_threshold,
    enable_extended_onboarding,
    enable_non_transit_trip_search,
    enable_show_valid_time_info,
    enable_loading_screen,
    enable_loading_error_screen,
    token_timeout_in_seconds,
    enable_beacons,
    delay_share_travel_habits_screen_by_sessions_count,
    enable_parking_violations_reporting,
    enable_push_notifications,
    enable_ticket_information,
    enable_on_behalf_of,
    enable_posthog,
  };
}

// Pick keys of certain value type
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

export function getBooleanConfigValue(
  key: keyof SubType<RemoteConfig, boolean>,
) {
  return remoteConfig().getBoolean(key);
}

export function getStringConfigValue(key: keyof SubType<RemoteConfig, string>) {
  return remoteConfig().getString(key);
}

export function getNumberConfigValue(key: keyof SubType<RemoteConfig, number>) {
  return remoteConfig().getNumber(key);
}
