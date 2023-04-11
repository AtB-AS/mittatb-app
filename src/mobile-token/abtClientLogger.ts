import Bugsnag, {Event} from '@bugsnag/react-native';
import {ClientConfig} from '@entur-private/abt-mobile-client-sdk';

export const logger: ClientConfig['logger'] = {
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
