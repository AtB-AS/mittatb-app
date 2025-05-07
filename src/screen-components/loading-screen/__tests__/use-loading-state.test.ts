import {act, renderHook} from '@testing-library/react-hooks';
import {useLoadingState} from '../use-loading-state';
import {LoadingParams} from '../types';

const DEFAULT_MOCK_STATE: LoadingParams = {
  isLoadingAppState: true,
  authStatus: 'loading',
  firestoreConfigStatus: 'loading',
  userId: 'user1',
  remoteConfigIsLoaded: false,
};

let mockState = DEFAULT_MOCK_STATE;

let mockRetryAuthInvoked = false;
let mockRetryFirestoreConfigInvoked = false;

jest.mock('@atb/modules/auth', () => ({
  useAuthContext: () => ({
    userId: mockState.userId,
    authStatus: mockState.authStatus,
    retryAuth: () => {
      mockRetryAuthInvoked = true;
    },
  }),
}));
jest.mock('@atb/configuration', () => ({
  useFirestoreConfigurationContext: () => ({
    firestoreConfigStatus: mockState.firestoreConfigStatus,
    resubscribeFirestoreConfig: () => {
      mockRetryFirestoreConfigInvoked = true;
    },
  }),
}));
jest.mock('@atb/screen-components/loading-screen', () => ({
  useIsLoadingAppState: () => mockState.isLoadingAppState,
}));

jest.mock('@atb/RemoteConfigContext', () => ({
  useRemoteConfigContext: () => ({
    isLoaded: mockState.remoteConfigIsLoaded,
  }),
}));

describe('useLoadingState', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockState = DEFAULT_MOCK_STATE;
    mockRetryAuthInvoked = false;
    mockRetryFirestoreConfigInvoked = false;
  });
  afterAll(() => jest.useRealTimers());

  it('Should give loading', async () => {
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('loading');

    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');

    mockState = {
      isLoadingAppState: true,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');

    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: false,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');
  });

  it('Should give timeout after given ms', async () => {
    const hook_100ms = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(90));
    expect(hook_100ms.result.current.status).toBe('loading');
    act(() => jest.advanceTimersByTime(20));
    expect(hook_100ms.result.current.status).toBe('timeout');

    const hook_300ms = renderHook(() => useLoadingState(300));
    act(() => jest.advanceTimersByTime(290));
    expect(hook_300ms.result.current.status).toBe('loading');
    act(() => jest.advanceTimersByTime(20));
    expect(hook_300ms.result.current.status).toBe('timeout');
  });

  it('Should give success', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('success');
    expect(hook.result.all.length).toBe(1); // Should not return once with state 'loading' on first render
  });

  it('Should go from loading to success', async () => {
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('loading');
    act(() => jest.advanceTimersByTime(50));
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go from timeout to success', async () => {
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go from success to loading', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('success');
    mockState = {
      isLoadingAppState: true,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');
  });

  it('Should not go from timeout to loading', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {
      isLoadingAppState: true,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('timeout');
  });

  it('Should not go to timeout after timeout ms if state is success', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(80));
    expect(hook.result.current.status).toBe('loading');
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
    act(() => jest.advanceTimersByTime(50));
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go to loading after retry', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(hook.result.current.status).toBe('loading');
  });

  it('Should go to success after retry', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    act(() => hook.result.current.retry());
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go to success after retry when receiving firestor config data', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'loading',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      remoteConfigIsLoaded: true,
    };
    act(() => hook.result.current.retry());
    expect(hook.result.current.status).toBe('success');
  });

  it('Should not retry auth if auth status is loading', async () => {
    mockState = {
      isLoadingAppState: true,
      authStatus: 'fetching-id-token',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(false);
  });

  it('Should retry auth if auth status is not authenticated', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'fetching-id-token',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(true);
  });

  it('Should resubscribe FirestoreConfig if firestore config has no cached data', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'loading',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryFirestoreConfigInvoked).toBe(true);
  });

  it('Should not retry auth if auth status is authenticated', async () => {
    mockState = {
      isLoadingAppState: true,
      authStatus: 'authenticated',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(false);
  });
  it('Should not resubscribe FirestoreConfig if firestore config has cached data', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryFirestoreConfigInvoked).toBe(false);
  });
  it('User change should reset timeout status', async () => {
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user1',
      remoteConfigIsLoaded: true,
    };
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    hook.rerender();
    expect(hook.result.current.status).toBe('timeout');
    mockState = {
      isLoadingAppState: false,
      authStatus: 'loading',
      firestoreConfigStatus: 'success',
      userId: 'user2',
      remoteConfigIsLoaded: true,
    };
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');
  });
});
