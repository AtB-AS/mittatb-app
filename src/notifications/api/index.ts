import {client} from '@atb/api';
import {Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';
import {getApplicationName} from 'react-native-device-info/src';

export const registerForPushNotifications = (token: string) =>
  client
    .post(
      `/notification/v1/register`,
      {
        app_id: getApplicationName(),
        app_version: getVersion(),
        platform: Platform.OS,
        platform_version: Platform.Version,
        language: 'no',
        token,
      },
      {authWithIdToken: true},
    )
    .then((response) => {
      return response.status === 200;
    });
