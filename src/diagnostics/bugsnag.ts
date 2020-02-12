import {Client} from 'bugsnag-react-native';
import {getInstallId} from '../utils/installId';

const client = new Client('61fa3faa9328f37c95c019dde6c95ba5');

async function setInstallId() {
  try {
    const installid = await getInstallId();
    client.setUser(installid);
  } catch {}
}

setInstallId();

export default client;
