import {act, renderHook} from '@testing-library/react-hooks';
import {
  LoadingParams,
  useLoadingState,
} from '@atb/loading-screen/use-loading-state';

const DEFAULT_MOCK_STATE: LoadingParams = {
  isLoadingAppState: true,
  authStatus: 'loading',
};

let mockState = DEFAULT_MOCK_STATE;

let mockRetryAuthInvoked = false;

jest.mock('@atb/auth', () => ({
  useAuthState: () => ({
    authStatus: mockState.authStatus,
    retryAuth: () => {
      mockRetryAuthInvoked = true;
    },
  }),
}));
jest.mock('@atb/AppContext', () => ({
  useAppState: () => ({isLoading: mockState.isLoadingAppState}),
}));

describe('useLoadingState', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockState = DEFAULT_MOCK_STATE;
    mockRetryAuthInvoked = false;
  });
  afterAll(() => jest.useRealTimers());

  it('Should give loading', async () => {
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('loading');

    mockState = {isLoadingAppState: false, authStatus: 'loading'};
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');

    mockState = {isLoadingAppState: true, authStatus: 'authenticated'};
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
    mockState = {isLoadingAppState: false, authStatus: 'authenticated'};
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go from loading to success', async () => {
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('loading');
    act(() => jest.advanceTimersByTime(50));
    mockState = {isLoadingAppState: false, authStatus: 'authenticated'};
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go from timeout to success', async () => {
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {isLoadingAppState: false, authStatus: 'authenticated'};
    hook.rerender();
    expect(hook.result.current.status).toBe('success');
  });

  it('Should go from success to loading', async () => {
    mockState = {isLoadingAppState: false, authStatus: 'authenticated'};
    const hook = renderHook(() => useLoadingState(100));
    expect(hook.result.current.status).toBe('success');
    mockState = {isLoadingAppState: true, authStatus: 'authenticated'};
    hook.rerender();
    expect(hook.result.current.status).toBe('loading');
  });

  it('Should not go from timeout to loading', async () => {
    mockState = {isLoadingAppState: false, authStatus: 'loading'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {isLoadingAppState: true, authStatus: 'loading'};
    hook.rerender();
    expect(hook.result.current.status).toBe('timeout');
  });

  it('Should go to loading after retry', async () => {
    mockState = {isLoadingAppState: false, authStatus: 'loading'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(hook.result.current.status).toBe('loading');
  });

  it('Should go to success after retry', async () => {
    mockState = {isLoadingAppState: false, authStatus: 'loading'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    mockState = {isLoadingAppState: false, authStatus: 'authenticated'};
    act(() => hook.result.current.retry());
    expect(hook.result.current.status).toBe('success');
  });

  it('Should not retry auth if auth status is loading', async () => {
    mockState = {isLoadingAppState: true, authStatus: 'creating-account'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(false);
  });

  it('Should retry auth if auth status is not authenticated', async () => {
    mockState = {isLoadingAppState: false, authStatus: 'creating-account'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(true);
  });

  it('Should not retry auth if auth status is authenticated', async () => {
    mockState = {isLoadingAppState: true, authStatus: 'authenticated'};
    const hook = renderHook(() => useLoadingState(100));
    act(() => jest.advanceTimersByTime(120));
    expect(hook.result.current.status).toBe('timeout');
    act(() => hook.result.current.retry());
    expect(mockRetryAuthInvoked).toBe(false);
  });
});
