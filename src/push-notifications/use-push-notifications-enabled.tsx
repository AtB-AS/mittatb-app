import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const usePushNotificationsEnabled = () => {
  const {enable_push_notifications} = useRemoteConfig();
  const [debugOverride] = usePushNotificationsEnabledDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_push_notifications;
};

export const usePushNotificationsEnabledDebugOverride = () => {
  return useDebugOverride(
    StorageModelKeysEnum.EnablePushNotificationsDebugOverride,
  );
};
