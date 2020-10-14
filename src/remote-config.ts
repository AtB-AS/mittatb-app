import remoteConfig from '@react-native-firebase/remote-config';

export type RemoteConfig = {
  enable_ticketing: boolean;
  enable_intercom: boolean;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_ticketing: false,
  enable_intercom: true,
};

export async function getConfig(): Promise<RemoteConfig> {
  const values = remoteConfig().getAll();
  const enable_ticketing = !!(values['enable_ticketing']?.value ?? false);
  const enable_intercom = !!(values['enable_intercom']?.value ?? true);
  return {enable_ticketing, enable_intercom};
}
