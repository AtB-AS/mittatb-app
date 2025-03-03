import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';
import {ClientLogger} from '@entur-private/abt-log-javascript-lib';
import {RemoteLogger} from '@entur-private/abt-mobile-client-sdk/lib/logger';

export const localLogger: ClientLogger = {
  debug: (msg, metadata?) => {
    logToBugsnag('Mobiletoken sdk debug message: ' + msg, {metadata: metadata});
  },
  info: (msg, metadata?) => {
    logToBugsnag('Mobiletoken sdk info message: ' + msg, {metadata: metadata});
  },
  warn: (msg, err, metadata?) => {
    logToBugsnag('Mobiletoken sdk info message: ' + msg, metadata);
    const onError = toOnErrorCallback('warning', msg, metadata);
    if (err) notifyBugsnag(err, {errorGroupHash: 'token', metadata: onError});
  },
  error: (msg, err, metadata?) => {
    logToBugsnag('Mobiletoken sdk info message: ' + msg, metadata);
    const onError = toOnErrorCallback('error', msg, metadata);
    if (err) notifyBugsnag(err, {errorGroupHash: 'token', metadata: onError});
  },
};

export const remoteLogger: RemoteLogger = {
  message: (message, level) => {
    logToBugsnag(`Mobiletoken sdk remote logger ${level} message: ${message}`);
  },
  error: (err) => {
    notifyBugsnag(err, {
      errorGroupHash: 'token',
      metadata: {
        error: 'Mobiletoken sdk remote logger caught an error',
        ...errorToMetadata(err),
      },
    });
  },
};

const toOnErrorCallback = (logLevel: string, msg: string, metadata?: Error) => {
  return {
    logLevel: logLevel,
    originalMessage: msg,
    ...(errorToMetadata(metadata) || {}),
  };
};
