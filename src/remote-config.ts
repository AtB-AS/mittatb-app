import remoteConfig from '@react-native-firebase/remote-config';
import {PRIVACY_POLICY_URL, ENABLE_TICKETING} from '@env';

import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from './reference-data/defaults';

export type RemoteConfig = {
  modes_we_sell_tickets_for: string;
  enable_network_logging: boolean;
  enable_ticketing: boolean;
  enable_intercom: boolean;
  enable_i18n: boolean;
  enable_creditcard: boolean;
  enable_recent_tickets: boolean;
  enable_period_tickets: boolean;
  must_upgrade_ticketing: boolean;
  news_enabled: boolean;
  news_text: string;
  news_link_text: string;
  news_link_url: string;
  vat_percent: number;
  preassigned_fare_products: string;
  tariff_zones: string;
  user_profiles: string;
  customer_service_url: string;
  customer_feedback_url: string | null;
  tripsSearch_target_number_of_initial_hits: number;
  tripsSearch_target_number_of_page_hits: number;
  tripsSearch_max_number_of_chained_searches: number;
  privacy_policy_url: string;
  service_disruption_url: string;
};

export const defaultModesWeSellTicketsFor: string[] = [
  'cityTram',
  'expressBus',
  'localBus',
  'localTram',
  'regionalBus',
  'shuttleBus',
];

export const defaultRemoteConfig: RemoteConfig = {
  modes_we_sell_tickets_for: JSON.stringify(defaultModesWeSellTicketsFor),
  enable_network_logging: true,
  enable_ticketing: !!JSON.parse(ENABLE_TICKETING || 'false'),
  enable_intercom: true,
  enable_i18n: false,
  enable_creditcard: false,
  enable_recent_tickets: false,
  enable_period_tickets: false,
  must_upgrade_ticketing: false,
  news_enabled: false,
  news_text: '',
  news_link_text: 'Les mer',
  news_link_url: '',
  vat_percent: 6,
  preassigned_fare_products: JSON.stringify(defaultPreassignedFareProducts),
  tariff_zones: JSON.stringify(defaultTariffZones),
  user_profiles: JSON.stringify(defaultUserProfiles),
  customer_service_url: 'https://www.atb.no/kontakt/',
  customer_feedback_url: null,
  tripsSearch_target_number_of_initial_hits: 8,
  tripsSearch_target_number_of_page_hits: 8,
  tripsSearch_max_number_of_chained_searches: 5,
  privacy_policy_url: PRIVACY_POLICY_URL,
  service_disruption_url: '',
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
  const must_upgrade_ticketing =
    values['must_upgrade_ticketing']?.asBoolean() ?? false;
  const news_enabled = values['news_enabled']?.asBoolean() ?? false;
  const news_text = values['news_text']?.asString() ?? '';
  const news_link_text = values['news_link_text']?.asString() ?? 'Les mer';
  const news_link_url = values['news_link_url']?.asString() ?? '';
  const vat_percent =
    values['vat_percent']?.asNumber() ?? defaultRemoteConfig.vat_percent;
  const modes_we_sell_tickets_for =
    values['modes_we_sell_tickets_for']?.asString() ??
    defaultRemoteConfig.modes_we_sell_tickets_for;
  const preassigned_fare_products =
    values['preassigned_fare_products_v2']?.asString() ??
    defaultRemoteConfig.preassigned_fare_products;
  const tariff_zones =
    values['tariff_zones']?.asString() ?? defaultRemoteConfig.tariff_zones;
  const user_profiles =
    values['user_profiles']?.asString() ?? defaultRemoteConfig.user_profiles;
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

  return {
    modes_we_sell_tickets_for,
    enable_network_logging,
    enable_ticketing,
    enable_intercom,
    enable_i18n,
    enable_creditcard,
    enable_recent_tickets,
    enable_period_tickets,
    must_upgrade_ticketing,
    news_enabled,
    news_text,
    news_link_url,
    news_link_text,
    vat_percent,
    preassigned_fare_products,
    tariff_zones,
    user_profiles,
    customer_service_url,
    customer_feedback_url,
    tripsSearch_target_number_of_initial_hits,
    tripsSearch_target_number_of_page_hits,
    tripsSearch_max_number_of_chained_searches,
    privacy_policy_url,
    service_disruption_url,
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
