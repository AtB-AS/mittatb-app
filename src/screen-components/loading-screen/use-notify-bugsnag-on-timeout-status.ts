import {useEffect} from 'react';
import {LoadingState} from './types';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export const useNotifyBugsnagOnTimeoutStatus = (
  status: LoadingState['status'],
  paramsRef: LoadingState['paramsRef'],
) => {
  useEffect(() => {
    if (status === 'timeout') {
      notifyBugsnag('Loading boundary timeout', {
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {...paramsRef.current},
      });
    }
  }, [status, paramsRef]);
};
