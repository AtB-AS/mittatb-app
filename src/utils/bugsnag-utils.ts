import Bugsnag, {Event, NotifiableError} from '@bugsnag/react-native';

type MetaData = {[key: string]: any};

/**
 * A utility function that acts as a facade against Bugsnag,
 * ensures that the correct grouping is provided,
 * and is easier to mock for testing Bugsnag notifications.
 *
 * Please see
 * {@link https://github.com/AtB-AS/docs-private/blob/main/bugsnag.md|bugsnag.md}
 *
 * @param error error object (@see {@link NotifiableError})
 *
 * @param errorGroupHash error group hash, determines the grouping of issues
 * ({@link https://docs.bugsnag.com/product/error-grouping/#custom-grouping-hash|see official docs} for more info)
 *
 * @param metadata metadata to send with the error report.
 *
 * @returns
 */
export const notifyBugsnag = (
  error: NotifiableError,
  options?: {errorGroupHash?: string; metadata?: MetaData},
) =>
  Bugsnag.notify(
    error,
    options
      ? (event: Event) => {
          event.groupingHash = options.errorGroupHash;
          options.metadata && event.addMetadata('metadata', options.metadata);
        }
      : undefined,
  );

export const logToBugsnag = (message: string, metadata?: MetaData) =>
  Bugsnag.leaveBreadcrumb(message, metadata);

export const errorToMetadata = (error: any) => {
  const name = 'name' in error ? {errorName: error.name} : undefined;
  const message =
    'message' in error ? {errorMessage: error.message} : undefined;
  return name || message ? {...name, ...message} : undefined;
};
