import Bugsnag, {Event} from '@bugsnag/react-native';
import {AbtClientLogger} from '@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src/logger';

const logger: AbtClientLogger = {
  info: (msg, metadata?) => {
    Bugsnag.leaveBreadcrumb(msg, metadata);
  },
  error: (err, metadata?) => {
    const onError = metadata
      ? (event: Event) => {
          event.addMetadata('metadata', metadata);
        }
      : undefined;
    if (err) Bugsnag.notify(err, onError);
  },
};

export default logger;
