import {client} from '@atb/api';
import {
  NotificationConfig,
  NotificationConfigType,
  NotificationConfigValue,
} from '../types';
import {LanguageAndTextLanguagesEnum} from '@atb/translations/types';

export const registerForPushNotifications = ({
  token,
  language,
  enabled,
}: {
  token: string;
  language: LanguageAndTextLanguagesEnum;
  enabled: boolean;
}) =>
  client
    .post(
      `/notification/v1/register`,
      {
        language,
        token,
        enabled,
      },
      {authWithIdToken: true},
    )
    .then((response) => {
      return response.status === 200;
    });

export const getNotificationConfig = (): Promise<NotificationConfig> =>
  client
    .get<NotificationConfig>('/notification/v1/config', {authWithIdToken: true})
    .then((response) => response.data);

export interface NotificationConfigUpdate extends NotificationConfigValue {
  config_type: NotificationConfigType;
}

export const updateNotificationConfig = (
  update: NotificationConfigUpdate,
): Promise<void> => {
  return client.patch('/notification/v1/config', update, {
    authWithIdToken: true,
  });
};
