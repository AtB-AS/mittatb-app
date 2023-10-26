import {renderHook} from '@testing-library/react-hooks';
import {LoadingParams, LoadingStatus} from '@atb/loading-screen/types';
import {useNotifyBugsnagOnTimeoutStatus} from '@atb/loading-screen/use-notify-bugsnag-on-timeout-status';
import React, {MutableRefObject} from 'react';
import jestExpect from 'expect';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

let mockBugsnagNotification: Parameters<typeof notifyBugsnag> | undefined;

jest.mock('@atb/utils/bugsnag-utils', () => ({
  notifyBugsnag: (error: string, metadata: any) => {
    mockBugsnagNotification = [error, metadata];
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
    const ref = createRef({isLoadingAppState: true, authStatus: 'loading',firestoreConfigStatus: 'success'});
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('timeout', ref));
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
  });

  it('Should not log event if status loading', async () => {
    const ref = createRef({isLoadingAppState: true, authStatus: 'loading', firestoreConfigStatus: 'success'});
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('loading', ref));
    expect(mockBugsnagNotification).toEqual(undefined);
  });

  it('Should not log event if status success', async () => {
    const ref = createRef({isLoadingAppState: true, authStatus: 'loading', firestoreConfigStatus: 'success'});
    renderHook(() => useNotifyBugsnagOnTimeoutStatus('success', ref));
    expect(mockBugsnagNotification).toEqual(undefined);
  });

  it('Should log event on rerender if status changes to timeout', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
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
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
  });

  it('Should not log event on rerender when no params change', async () => {
    const ref = createRef({isLoadingAppState: true, authStatus: 'loading', firestoreConfigStatus: 'success'});
    const hook = renderHook(() =>
      useNotifyBugsnagOnTimeoutStatus('timeout', ref),
    );
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
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
    });
    const hook = renderHook(
      ({status}) => useNotifyBugsnagOnTimeoutStatus(status, ref),
      {
        initialProps: {status: 'loading' as LoadingStatus},
      },
    );
    expect(mockBugsnagNotification).toEqual(undefined);
    ref.current = {isLoadingAppState: true, authStatus: 'creating-account', firestoreConfigStatus: 'success'};
    hook.rerender({status: 'timeout'});
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'creating-account',
      }),
    ]);
  });

  it('Should not log event again when ref params change', async () => {
    const ref = createRef({isLoadingAppState: true, authStatus: 'loading', firestoreConfigStatus: 'success'});
    const hook = renderHook(() =>
      useNotifyBugsnagOnTimeoutStatus('timeout', ref),
    );
    expect(mockBugsnagNotification).toEqual([
      jestExpect.stringMatching('Loading boundary timeout'),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
    mockBugsnagNotification = undefined;
    ref.current = {isLoadingAppState: true, authStatus: 'creating-account', firestoreConfigStatus: 'success'};
    hook.rerender();
    expect(mockBugsnagNotification).toEqual(undefined);
  });
});

const createRef = (params: LoadingParams): MutableRefObject<LoadingParams> => {
  const ref: MutableRefObject<LoadingParams | null> = React.createRef();
  ref.current = params;
  return ref as MutableRefObject<LoadingParams>;
};
