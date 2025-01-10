import Bugsnag, {Event} from '@bugsnag/react-native';
import {ClientConfig} from '@entur-private/abt-mobile-client-sdk';
import {isRemoteTokenStateError} from './utils';

export const localLogger: ClientConfig['localLogger'] = {
  debug: (msg, metadata?) => {
    Bugsnag.leaveBreadcrumb('Mobiletoken sdk debug message: ' + msg, metadata);
  },
  info: (msg, metadata?) => {
    Bugsnag.leaveBreadcrumb('Mobiletoken sdk info message: ' + msg, metadata);
  },
  warn: (msg, err, metadata?) => {
    const onError = toOnErrorCallback('warning', msg, metadata);
    if (err) Bugsnag.notify(err, onError);
  },
  error: (msg, err, metadata?) => {
    const onError = toOnErrorCallback('error', msg, metadata);
    if (err) Bugsnag.notify(err, onError);
  },
};

export const remoteLogger: ClientConfig['remoteLogger'] = (err) => {
  const onError = toOnErrorCallback(
    'error',
    'Mobiletoken sdk remote logger error',
  );
  if (!isRemoteTokenStateError(err)) {
    Bugsnag.notify(err, onError);
  }
};

const toOnErrorCallback =
  (logLevel: string, msg: string, metadata?: Record<string, string>) =>
  (event: Event) => {
    event.addMetadata('metadata', {
      logLevel: logLevel,
      originalMessage: msg,
      ...(metadata || {}),
    });
  };
