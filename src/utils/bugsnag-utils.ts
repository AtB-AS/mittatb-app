/*
This utils is a slightly simpler to use facade against Bugsnag, and is
easier to mock when needing to mock or test Bugsnag notifications.
 */
import Bugsnag, {Event, NotifiableError} from '@bugsnag/react-native';

type MetaData = {[key: string]: any};

export const notifyBugsnag = (error: NotifiableError, metadata: MetaData) =>
  Bugsnag.notify(error, (event: Event) => {
    event.addMetadata('metadata', metadata);
  });

export const logToBugsnag = (message: string, metadata: MetaData) =>
  Bugsnag.leaveBreadcrumb(message, metadata);
