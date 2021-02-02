import remoteConfig from '@react-native-firebase/remote-config';
import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from './reference-data/defaults';

export type RemoteConfig = {
  enable_network_logging: boolean;
  enable_ticketing: boolean;
  enable_intercom: boolean;
  enable_i18n: boolean;
  enable_creditcard: boolean;
  must_upgrade_ticketing: boolean;
  news_enabled: boolean;
  news_text: string;
  news_link_text: string;
  news_link_url: string;
  preassigned_fare_products: string;
  tariff_zones: string;
  user_profiles: string;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_network_logging: true,
  enable_ticketing: false,
  enable_intercom: true,
  enable_i18n: false,
  enable_creditcard: false,
  must_upgrade_ticketing: false,
  news_enabled: false,
  news_text: '',
  news_link_text: 'Les mer',
  news_link_url: '',
  preassigned_fare_products: JSON.stringify(defaultPreassignedFareProducts),
  tariff_zones: JSON.stringify(defaultTariffZones),
  user_profiles: JSON.stringify(defaultUserProfiles),
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
  const must_upgrade_ticketing =
    values['must_upgrade_ticketing']?.asBoolean() ?? false;
  const news_enabled = values['news_enabled']?.asBoolean() ?? false;
  const news_text = values['news_text']?.asString() ?? '';
  const news_link_text = values['news_link_text']?.asString() ?? 'Les mer';
  const news_link_url = values['news_link_url']?.asString() ?? '';
  const preassigned_fare_products =
    values['preassigned_fare_products']?.asString() ??
    defaultRemoteConfig.preassigned_fare_products;
  const tariff_zones =
    values['tariff_zones']?.asString() ?? defaultRemoteConfig.tariff_zones;
  const user_profiles =
    values['user_profiles']?.asString() ?? defaultRemoteConfig.user_profiles;

  return {
    enable_network_logging,
    enable_ticketing,
    enable_intercom,
    enable_i18n,
    enable_creditcard,
    must_upgrade_ticketing,
    news_enabled,
    news_text,
    news_link_url,
    news_link_text,
    preassigned_fare_products,
    tariff_zones,
    user_profiles,
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
