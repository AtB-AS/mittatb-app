import remoteConfig from '@react-native-firebase/remote-config';

export type RemoteConfig = {
  enable_ticketing: boolean;
  enable_intercom: boolean;
  news_enabled: boolean;
  news_text: string;
  news_link_text: string;
  news_link_url: string;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_ticketing: false,
  enable_intercom: true,
  news_enabled: false,
  news_text: '',
  news_link_text: 'Les mer',
  news_link_url: '',
};

export async function getConfig(): Promise<RemoteConfig> {
  const values = remoteConfig().getAll();
  const enable_ticketing = !!(values['enable_ticketing']?.asBoolean() ?? false);
  const enable_intercom = !!(values['enable_intercom']?.asBoolean() ?? true);
  const news_enabled = values['news_enabled']?.asBoolean() ?? false;
  const news_text = values['news_text']?.asString() ?? '';
  const news_link_text = values['news_link_text']?.asString() ?? 'Les mer';
  const news_link_url = values['news_link_url']?.asString() ?? '';
  return {
    enable_ticketing,
    enable_intercom,
    news_enabled,
    news_text,
    news_link_url,
    news_link_text,
  };
}
