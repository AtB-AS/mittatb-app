import {useEffect} from 'react';
import {LoadingState} from '@atb/loading-screen/types';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export const useNotifyBugsnagOnTimeoutStatus = (
  status: LoadingState['status'],
  paramsRef: LoadingState['paramsRef'],
) => {
  useEffect(() => {
    if (status === 'timeout') {
      notifyBugsnag('Loading boundary timeout', {...paramsRef.current});
    }
  }, [status, paramsRef]);
};
