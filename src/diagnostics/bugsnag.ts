import {Client} from 'bugsnag-react-native';
import {getInstallId} from '../utils/installId';
import {BUGSNAG_API_KEY, APP_VERSION} from 'react-native-dotenv';

const client = new Client(BUGSNAG_API_KEY);
client.config.appVersion = APP_VERSION;

if (__DEV__) {
  client.config.registerBeforeSendCallback(function() {
    return false;
  });
}

async function setInstallId() {
  try {
    const installid = await getInstallId();
    client.setUser(installid);
  } catch {}
}

setInstallId();

export default client;
