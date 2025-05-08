import Bugsnag, {Event} from '@bugsnag/react-native';

/**
 * Set to true if you want Bugsnag breadcrumbs to be written to console.log
 * locally
 * */
const LOG_BREADCRUMBS_LOCALLY = false;

export function configureAndStartBugsnag() {
  if (!__DEV__) {
    Bugsnag.start();
  } else {
    Bugsnag.notify = function (error, onError) {
      const event = Event.create(
        error,
        true,
        {} as any,
        'notify()',
        1,
        console,
      );
      let metadata: {[key: string]: any} = {};
      event.addMetadata = (
        section: string,
        values: string | object,
        values2?: unknown,
      ) => {
        if (typeof values === 'string') {
          metadata[values] = values2;
        } else {
          metadata = {
            ...metadata,
            ...values,
          };
        }
      };
      onError?.(event, () => {});
      console.error('[BUGSNAG]', error, JSON.stringify(metadata, null, 2));
    };
    Bugsnag.leaveBreadcrumb = (message, metadata) => {
      if (LOG_BREADCRUMBS_LOCALLY) {
        // eslint-disable-next-line
        console.log(message, metadata || '');
      }
    };
    Bugsnag.setUser = () => {};
  }
}
