import Bugsnag, {Event} from '@bugsnag/react-native';
import {AbtClientConfig} from '@entur-private/abt-mobile-client-sdk';

export const logger: AbtClientConfig['logger'] = {
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
