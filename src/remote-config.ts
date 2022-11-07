import remoteConfig from '@react-native-firebase/remote-config';
import {PRIVACY_POLICY_URL, ENABLE_TICKETING} from '@env';

export type RemoteConfig = {
  enable_network_logging: boolean;
  enable_ticketing: boolean;
  enable_intercom: boolean;
  enable_i18n: boolean;
  enable_creditcard: boolean;
  enable_recent_tickets: boolean;
  enable_period_tickets: boolean;
  enable_login: boolean;
  enable_frontpage: boolean;
  feedback_questions: string;
  must_upgrade_ticketing: boolean;
  news_enabled: boolean;
  news_text: string;
  news_link_text: string;
  news_link_url: string;
  customer_service_url: string;
  customer_feedback_url: string;
  tripsSearch_target_number_of_initial_hits: number;
  tripsSearch_target_number_of_page_hits: number;
  tripsSearch_max_number_of_chained_searches: number;
  privacy_policy_url: string;
  service_disruption_url: string;
  enable_token_fallback: boolean;
  enable_flex_tickets: boolean;
  enable_vipps_login: boolean;
  enable_map_page: boolean;
  favourite_departures_poll_interval: number;
  new_favourites_info_url: string;
  enable_departures_v2_onboarding: boolean;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_network_logging: true,
  enable_ticketing: !!JSON.parse(ENABLE_TICKETING || 'false'),
  enable_intercom: true,
  enable_i18n: false,
  enable_creditcard: false,
  enable_recent_tickets: false,
  enable_period_tickets: false,
  enable_login: true,
  enable_frontpage: true,
  feedback_questions: '',
  must_upgrade_ticketing: false,
  news_enabled: false,
  news_text: '',
  news_link_text: 'Les mer',
  news_link_url: '',
  customer_service_url: 'https://www.atb.no/kontakt/',
  customer_feedback_url: '',
  tripsSearch_target_number_of_initial_hits: 8,
  tripsSearch_target_number_of_page_hits: 8,
  tripsSearch_max_number_of_chained_searches: 5,
  privacy_policy_url: PRIVACY_POLICY_URL,
  service_disruption_url: '',
  enable_token_fallback: true,
  enable_flex_tickets: false,
  enable_vipps_login: false,
  enable_map_page: false,
  favourite_departures_poll_interval: 30000,
  new_favourites_info_url: '',
  enable_departures_v2_onboarding: false,
};

export function getConfig(): RemoteConfig {
  const values = remoteConfig().getAll();
  const enable_network_logging = !!(
    values['enable_network_logging']?.asBoolean() ?? true
  );
  const enable_ticketing = !!(values['enable_ticketing']?.asBoolean() ?? false);
  const enable_intercom = !!(values['enable_intercom']?.asBoolean() ?? true);
  const enable_i18n = !!(values['enable_i18n']?.asBoolean() ?? false);
  const enable_creditcard =
    values['enable_creditcard']?.asBoolean() ??
    defaultRemoteConfig.enable_creditcard;
  const enable_recent_tickets =
    values['enable_recent_tickets']?.asBoolean() ??
    defaultRemoteConfig.enable_recent_tickets;
  const enable_period_tickets =
    values['enable_period_tickets']?.asBoolean() ??
    defaultRemoteConfig.enable_period_tickets;
  const enable_flex_tickets =
    values['enable_flex_tickets']?.asBoolean() ??
    defaultRemoteConfig.enable_flex_tickets;
  const enable_login =
    values['enable_login']?.asBoolean() ?? defaultRemoteConfig.enable_login;
  const enable_frontpage =
    values['enable_frontpage']?.asBoolean() ??
    defaultRemoteConfig.enable_frontpage;
  const feedback_questions =
    values['feedback_questions']?.asString() ??
    defaultRemoteConfig.feedback_questions;
  const must_upgrade_ticketing =
    values['must_upgrade_ticketing']?.asBoolean() ?? false;
  const news_enabled = values['news_enabled']?.asBoolean() ?? false;
  const news_text = values['news_text']?.asString() ?? '';
  const news_link_text = values['news_link_text']?.asString() ?? 'Les mer';
  const news_link_url = values['news_link_url']?.asString() ?? '';
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

  const enable_vipps_login =
    values['enable_vipps_login']?.asBoolean() ??
    defaultRemoteConfig.enable_vipps_login;

  const enable_map_tab =
    values['enable_map_tab']?.asBoolean() ??
    defaultRemoteConfig.enable_map_page;

  const favourite_departures_poll_interval =
    values['favourite_departures_poll_interval']?.asNumber() ??
    defaultRemoteConfig.favourite_departures_poll_interval;

  const new_favourites_info_url =
    values['new_favourites_info_url']?.asString() ??
    defaultRemoteConfig.new_favourites_info_url;

  const enable_departures_v2_onboarding =
    values['enable_departures_v2_onboarding']?.asBoolean() ??
    defaultRemoteConfig.enable_departures_v2_onboarding;

  return {
    enable_network_logging,
    enable_ticketing,
    enable_intercom,
    enable_i18n,
    enable_creditcard,
    enable_recent_tickets,
    enable_period_tickets,
    enable_login,
    enable_frontpage,
    feedback_questions,
    must_upgrade_ticketing,
    news_enabled,
    news_text,
    news_link_url,
    news_link_text,
    customer_service_url,
    customer_feedback_url,
    tripsSearch_target_number_of_initial_hits,
    tripsSearch_target_number_of_page_hits,
    tripsSearch_max_number_of_chained_searches,
    privacy_policy_url,
    service_disruption_url,
    enable_token_fallback,
    enable_flex_tickets,
    enable_vipps_login,
    enable_map_page: enable_map_tab,
    favourite_departures_poll_interval,
    new_favourites_info_url,
    enable_departures_v2_onboarding,
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
