import {renderHook} from '@testing-library/react-hooks';
import {LoadingParams, LoadingStatus} from '@atb/loading-screen/types';
import {useNotifyBugsnagOnTimeoutStatus} from '@atb/loading-screen/use-notify-bugsnag-on-timeout-status';
import React, {MutableRefObject} from 'react';
import jestExpect from 'expect';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

let mockBugsnagNotification: Parameters<typeof notifyBugsnag> | undefined;

jest.mock('@atb/utils/bugsnag-utils', () => ({
  notifyBugsnag: (
    error: string,
    options: {errorGroupHash: string; metadata: any},
  ) => {
    mockBugsnagNotification = [error, options];
  },
}));

describe('useNotifyBugsnagOnTimeoutStatus', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockBugsnagNotification = undefined;
  });
  afterAll(() => jest.useRealTimers());

  it('Should log event if status timeout', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('timeout', ref));
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {
          isLoadingAppState: true,
          authStatus: 'loading',
          firestoreConfigStatus: 'success',
          remoteConfigIsLoaded: true,
        },
      }),
    ]);
  });

  it('Should not log event if status loading', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('loading', ref));
    expect(mockBugsnagNotification).toEqual(undefined);
  });

  it('Should not log event if status success', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('success', ref));
    expect(mockBugsnagNotification).toEqual(undefined);
  });

  it('Should log event on rerender if status changes to timeout', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    const hook = renderHook(
      ({status}) => useNotifyBugsnagOnTimeoutStatus(status, ref),
      {
        initialProps: {status: 'loading' as LoadingStatus},
      },
    );
    expect(mockBugsnagNotification).toEqual(undefined);
    hook.rerender({status: 'timeout'});
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {
          isLoadingAppState: true,
          authStatus: 'loading',
          firestoreConfigStatus: 'success',
          remoteConfigIsLoaded: true,
        },
      }),
    ]);
  });

  it('Should not log event on rerender when no params change', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    const hook = renderHook(() =>
      useNotifyBugsnagOnTimeoutStatus('timeout', ref),
    );
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {
          isLoadingAppState: true,
          authStatus: 'loading',
          firestoreConfigStatus: 'success',
          remoteConfigIsLoaded: true,
        },
      }),
    ]);
    mockBugsnagNotification = undefined;
    hook.rerender();
    expect(mockBugsnagNotification).toEqual(undefined);
  });

  it('Should log event with updated ref params', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    const hook = renderHook(
      ({status}) => useNotifyBugsnagOnTimeoutStatus(status, ref),
      {
        initialProps: {status: 'loading' as LoadingStatus},
      },
    );
    expect(mockBugsnagNotification).toEqual(undefined);
    ref.current = {
      isLoadingAppState: true,
      authStatus: 'fetching-id-token',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    };
    hook.rerender({status: 'timeout'});
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {
          isLoadingAppState: true,
          authStatus: 'fetching-id-token',
          firestoreConfigStatus: 'success',
          remoteConfigIsLoaded: true,
        },
      }),
    ]);
  });

  it('Should not log event again when ref params change', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    });
    const hook = renderHook(() =>
      useNotifyBugsnagOnTimeoutStatus('timeout', ref),
    );
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        errorGroupHash: 'LoadingBoundaryTimeoutError',
        metadata: {
          isLoadingAppState: true,
          authStatus: 'loading',
          firestoreConfigStatus: 'success',
          remoteConfigIsLoaded: true,
        },
      }),
    ]);
    mockBugsnagNotification = undefined;
    ref.current = {
      isLoadingAppState: true,
      authStatus: 'fetching-id-token',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(mockBugsnagNotification).toEqual(undefined);
  });
});

const createRef = (params: LoadingParams): MutableRefObject<LoadingParams> => {
  const ref: MutableRefObject<LoadingParams | null> = React.createRef();
  ref.current = params;
  return ref as MutableRefObject<LoadingParams>;
};
