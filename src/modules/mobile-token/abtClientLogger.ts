import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';
import {
  ClientLogger,
  ClientNetworkError,
} from '@entur-private/react-native-abt';

/**
 * Only SDK errors are sent to Bugsnag as events. Warnings are usually followed
 * by an error for the same failure, so they are kept as breadcrumbs. Network
 * errors are kept as breadcrumbs too, as they only mean the device is offline.
 */
export const localLogger: ClientLogger = {
  debug: (name, message) => {
    logToBugsnag(`Mobiletoken sdk debug message: ${name}: ${message}`);
  },
  info: (name, message) => {
    logToBugsnag(`Mobiletoken sdk info message: ${name}: ${message}`);
  },
  warn: (name, message, error) => {
    logToBugsnag(
      `Mobiletoken sdk warn message: ${name}: ${message}`,
      toMetadata('warning', name, message, error),
    );
  },
  error: (name, message, error) => {
    const metadata = toMetadata('error', name, message, error);
    logToBugsnag(
      `Mobiletoken sdk error message: ${name}: ${message}`,
      metadata,
    );
    if (error instanceof ClientNetworkError) return;
    notifyBugsnag(error ?? new Error(`${name}: ${message}`), {
      errorGroupHash: 'token',
      metadata,
    });
  },
};

const toMetadata = (
  logLevel: string,
  name: string,
  message: string,
  error?: Error,
) => ({
  logLevel,
  originalName: name,
  originalMessage: message,
  stack: error?.stack,
  ...(errorToMetadata(error) || {}),
});
