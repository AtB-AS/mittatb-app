import {client} from '@atb/api';
import {Platform} from 'react-native';
import {getBundleId, getVersion} from 'react-native-device-info';
import {
  NotificationConfig,
  NotificationConfigType,
  NotificationConfigValue,
} from '../types';
import {Preference_Language} from '@atb/preferences';

export const registerForPushNotifications = ({
  token,
  language,
}: {
  token: string;
  language: Preference_Language;
}) =>
  client
    .post(
      `/notification/v1/register`,
      {
        app_id: getBundleId(),
        app_version: getVersion(),
        platform: Platform.OS,
        platform_version: String(Platform.Version),
        language,
        token,
      },
      {authWithIdToken: true},
    )
    .then((response) => {
      return response.status === 200;
    });

export const getConfig = (): Promise<NotificationConfig> =>
  client
    .get<NotificationConfig>('/notification/v1/config', {authWithIdToken: true})
    .then((response) => response.data);

export interface NotificationConfigUpdate extends NotificationConfigValue {
  config_type: NotificationConfigType;
}

export const updateConfig = (
  update: NotificationConfigUpdate,
): Promise<void> => {
  // TODO: The /config endpoint supports patch as well, but currently this does not work properly.
  // This function should be rewritten to use PATCH whenever that is ready.
  // return client.patch('/notification/v1/config', update, {
  //   authWithIdToken: true,
  // });
  // Temporary fix:
  return getConfig().then((config) => {
    const newConfig: NotificationConfig = {
      modes:
        update.config_type === 'mode'
          ? config.modes.map((m) =>
              m.id === update.id ? {...m, enabled: update.enabled} : m,
            )
          : config.modes,
      groups:
        update.config_type === 'group'
          ? config.groups.map((m) =>
              m.id === update.id ? {...m, enabled: update.enabled} : m,
            )
          : config.groups,
    };
    return client.post('/notification/v1/config', newConfig, {
      authWithIdToken: true,
    });
  });
};
