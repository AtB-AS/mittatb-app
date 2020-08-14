import {Client, Configuration} from 'bugsnag-react-native';
import {BUGSNAG_API_KEY, BUGSNAG_RELEASE_STAGE, APP_VERSION} from '@env';

const config = new Configuration(BUGSNAG_API_KEY);
config.appVersion = APP_VERSION;
config.releaseStage = BUGSNAG_RELEASE_STAGE;

if (__DEV__) {
  config.registerBeforeSendCallback(function () {
    return false;
  });
}

export default new Client(config);
