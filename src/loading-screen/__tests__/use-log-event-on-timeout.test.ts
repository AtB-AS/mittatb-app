import {renderHook} from '@testing-library/react-hooks';
import {LoadingParams, LoadingStatus} from '@atb/loading-screen/types';
import {useLogEventOnTimeoutStatus} from '@atb/loading-screen/use-log-event-on-timeout-status';
import React, {MutableRefObject} from 'react';
import {AnalyticsEventContext, useAnalytics} from '@atb/analytics';
import jestExpect from 'expect';

let mockLoggedEvent:
  | Parameters<ReturnType<typeof useAnalytics>['logEvent']>
  | undefined;

const logEventMock = {
  logEvent: (
    ctx: AnalyticsEventContext,
    event: string,
    props?: {[key: string]: any},
  ) => {
    mockLoggedEvent = [ctx, event, props];
  },
};

jest.mock('@atb/analytics', () => ({
  useAnalytics: () => logEventMock,
}));

describe('useLogEventOnTimeoutStatus', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockLoggedEvent = undefined;
  });
  afterAll(() => jest.useRealTimers());

  it('Should log event if status timeout', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    renderHook(() => useLogEventOnTimeoutStatus('timeout', ref));
    expect(mockLoggedEvent).toEqual([
      jestExpect.anything(),
      jestExpect.anything(),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
  });

  it('Should not log event if status loading', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    renderHook(() => useLogEventOnTimeoutStatus('loading', ref));
    expect(mockLoggedEvent).toEqual(undefined);
  });

  it('Should not log event if status success', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    renderHook(() => useLogEventOnTimeoutStatus('success', ref));
    expect(mockLoggedEvent).toEqual(undefined);
  });

  it('Should log event on rerender if status changes to timeout', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    const hook = renderHook(
      ({status}) => useLogEventOnTimeoutStatus(status, ref),
      {
        initialProps: {status: 'loading' as LoadingStatus},
      },
    );
    expect(mockLoggedEvent).toEqual(undefined);
    hook.rerender({status: 'timeout'});
    expect(mockLoggedEvent).toEqual([
      jestExpect.anything(),
      jestExpect.anything(),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
  });

  it('Should not log event on rerender when no params change', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    const hook = renderHook(() => useLogEventOnTimeoutStatus('timeout', ref));
    expect(mockLoggedEvent).toEqual([
      jestExpect.anything(),
      jestExpect.anything(),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
    mockLoggedEvent = undefined;
    hook.rerender();
    expect(mockLoggedEvent).toEqual(undefined);
  });

  it('Should log event with updated ref params', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    const hook = renderHook(
      ({status}) => useLogEventOnTimeoutStatus(status, ref),
      {
        initialProps: {status: 'loading' as LoadingStatus},
      },
    );
    expect(mockLoggedEvent).toEqual(undefined);
    ref.current = {
      isLoadingAppState: true,
      authStatus: 'creating-account',
      hasFirestoreConfigData: true,
    };
    hook.rerender({status: 'timeout'});
    expect(mockLoggedEvent).toEqual([
      jestExpect.anything(),
      jestExpect.anything(),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'creating-account',
      }),
    ]);
  });

  it('Should not log event again when ref params change', async () => {
    const ref = createRef({
      isLoadingAppState: true,
      authStatus: 'loading',
      hasFirestoreConfigData: true,
    });
    const hook = renderHook(() => useLogEventOnTimeoutStatus('timeout', ref));
    expect(mockLoggedEvent).toEqual([
      jestExpect.anything(),
      jestExpect.anything(),
      jestExpect.objectContaining({
        isLoadingAppState: true,
        authStatus: 'loading',
      }),
    ]);
    mockLoggedEvent = undefined;
    ref.current = {
      isLoadingAppState: true,
      authStatus: 'creating-account',
      hasFirestoreConfigData: true,
    };
    hook.rerender();
    expect(mockLoggedEvent).toEqual(undefined);
  });
});

const createRef = (params: LoadingParams): MutableRefObject<LoadingParams> => {
  const ref: MutableRefObject<LoadingParams | null> = React.createRef();
  ref.current = params;
  return ref as MutableRefObject<LoadingParams>;
};
