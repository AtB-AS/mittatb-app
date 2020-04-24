import remoteConfig from '@react-native-firebase/remote-config';

export type RemoteConfig = {
  enable_ticketing: boolean;
};

export const defaultRemoteConfig: RemoteConfig = {
  enable_ticketing: false,
};

export async function getConfig(): Promise<RemoteConfig> {
  const values = remoteConfig().getAll();
  const enable_ticketing = !!(values['enable_ticketing']?.value ?? false);
  return {enable_ticketing};
}
